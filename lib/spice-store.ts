import { menu } from "@/data/menu";

export type SpiceAggregate = { count: number; avg: number };
export type SpiceAggregates = Record<string, SpiceAggregate>;
export type SpiceVotes = Record<string, number>;

export type SpiceState = {
  aggregates: SpiceAggregates;
  myVotes: SpiceVotes;
  error: boolean;
};

const VOTER_KEY = "cherry-woken:voter";
const VOTES_KEY = "cherry-woken:spice-votes";

const VOTABLE_IDS = new Set<string>();
const NUMBER_TO_ID = new Map<string, string>();
for (const section of menu) {
  for (const dish of section.dishes) {
    if (dish.no != null) {
      VOTABLE_IDS.add(dish.id);
      NUMBER_TO_ID.set(String(dish.no), dish.id);
    }
  }
}

function migrateVotes(parsed: Record<string, unknown>): SpiceVotes {
  const next: SpiceVotes = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value !== "number") continue;
    if (VOTABLE_IDS.has(key)) {
      next[key] = value;
      continue;
    }
    const id = NUMBER_TO_ID.get(key);
    if (id) next[id] = value;
  }
  return next;
}

const SERVER_STATE: SpiceState = Object.freeze({
  aggregates: {},
  myVotes: {},
  error: false,
}) as SpiceState;

let state: SpiceState = { aggregates: {}, myVotes: {}, error: false };
let voterId = "";
let loaded = false;
let fetched = false;
const listeners = new Set<() => void>();

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `v-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  }
}

function readVoterId(): string {
  try {
    const existing = localStorage.getItem(VOTER_KEY);
    if (existing) return existing;
    const created = newId();
    localStorage.setItem(VOTER_KEY, created);
    return created;
  } catch {
    return newId();
  }
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  voterId = readVoterId();
  try {
    const raw = localStorage.getItem(VOTES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const migrated = migrateVotes(parsed as Record<string, unknown>);
        state = { ...state, myVotes: migrated };
        if (JSON.stringify(migrated) !== raw) persistVotes();
      }
    }
  } catch {
    return;
  }
}

function persistVotes() {
  try {
    localStorage.setItem(VOTES_KEY, JSON.stringify(state.myVotes));
  } catch {
    return;
  }
}

function commit(next: SpiceState) {
  state = next;
  for (const listener of listeners) listener();
}

async function loadAggregates() {
  if (fetched) return;
  fetched = true;
  try {
    const res = await fetch("/api/spice", { cache: "no-store" });
    if (!res.ok) {
      fetched = false;
      commit({ ...state, error: true });
      return;
    }
    const data = await res.json();
    if (data && data.aggregates && typeof data.aggregates === "object") {
      commit({
        ...state,
        aggregates: data.aggregates as SpiceAggregates,
        error: false,
      });
    }
  } catch {
    fetched = false;
    commit({ ...state, error: true });
  }
}

function optimistic(
  previous: SpiceAggregate | undefined,
  previousMine: number | undefined,
  level: number
): SpiceAggregate {
  const count = previous?.count ?? 0;
  const sum = (previous?.avg ?? 0) * count;
  if (previousMine == null) {
    const nextCount = count + 1;
    return { count: nextCount, avg: (sum + level) / nextCount };
  }
  const safeCount = count > 0 ? count : 1;
  return { count: safeCount, avg: (sum - previousMine + level) / safeCount };
}

export function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  void loadAggregates();
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): SpiceState {
  ensureLoaded();
  return state;
}

export function getServerSnapshot(): SpiceState {
  return SERVER_STATE;
}

export async function vote(id: string, level: number) {
  ensureLoaded();
  const previousAgg = state.aggregates[id];
  const previousMine = state.myVotes[id];

  commit({
    ...state,
    aggregates: {
      ...state.aggregates,
      [id]: optimistic(previousAgg, previousMine, level),
    },
    myVotes: { ...state.myVotes, [id]: level },
  });
  persistVotes();

  try {
    const res = await fetch("/api/spice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, level, voterId }),
    });
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    if (data && data.aggregate) {
      commit({
        ...state,
        aggregates: {
          ...state.aggregates,
          [id]: data.aggregate as SpiceAggregate,
        },
      });
    }
  } catch {
    const aggregates = { ...state.aggregates };
    if (previousAgg) aggregates[id] = previousAgg;
    else delete aggregates[id];
    const myVotes = { ...state.myVotes };
    if (previousMine != null) myVotes[id] = previousMine;
    else delete myVotes[id];
    commit({ ...state, aggregates, myVotes });
    persistVotes();
  }
}

export async function removeVote(id: string) {
  ensureLoaded();
  const previousMine = state.myVotes[id];
  if (previousMine == null) return;
  const previousAgg = state.aggregates[id];

  const aggregates = { ...state.aggregates };
  if (previousAgg && previousAgg.count > 1) {
    const nextCount = previousAgg.count - 1;
    aggregates[id] = {
      count: nextCount,
      avg: (previousAgg.avg * previousAgg.count - previousMine) / nextCount,
    };
  } else {
    delete aggregates[id];
  }
  const myVotes = { ...state.myVotes };
  delete myVotes[id];
  commit({ ...state, aggregates, myVotes });
  persistVotes();

  try {
    const res = await fetch("/api/spice", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, voterId }),
    });
    if (!res.ok) throw new Error("failed");
    const data = await res.json();
    if (data && data.aggregate) {
      const next = { ...state.aggregates };
      const agg = data.aggregate as SpiceAggregate;
      if (agg.count > 0) next[id] = agg;
      else delete next[id];
      commit({ ...state, aggregates: next });
    }
  } catch {
    const rollback = { ...state.aggregates };
    if (previousAgg) rollback[id] = previousAgg;
    else delete rollback[id];
    const myVotesRollback = { ...state.myVotes, [id]: previousMine };
    commit({ ...state, aggregates: rollback, myVotes: myVotesRollback });
    persistVotes();
  }
}
