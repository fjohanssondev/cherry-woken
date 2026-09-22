/**
 * A tiny external store for the visitor's personal pick list (which dishes and
 * how many). It lives outside React so any component can read or update it
 * without a provider, and it mirrors itself to localStorage so the list
 * survives a reload. Read it from components with `useSyncExternalStore`.
 */

import { menu } from "@/data/menu";

export type SelectionItems = Record<string, number>;

const STORAGE_KEY = "cherry-woken:selection";
const EMPTY: SelectionItems = Object.freeze({});

const ID_SET = new Set<string>();
const LEGACY_TO_ID = new Map<string, string>();
for (const section of menu) {
  for (const dish of section.dishes) {
    ID_SET.add(dish.id);
    const legacy = dish.no != null ? `n${dish.no}` : `x:${dish.name}`;
    LEGACY_TO_ID.set(legacy, dish.id);
  }
}

let items: SelectionItems = {};
let loaded = false;
const listeners = new Set<() => void>();

function migrate(parsed: Record<string, unknown>): {
  items: SelectionItems;
  changed: boolean;
} {
  const next: SelectionItems = {};
  let changed = false;
  for (const [key, value] of Object.entries(parsed)) {
    const qty = typeof value === "number" ? value : 0;
    if (qty <= 0) {
      changed = true;
      continue;
    }
    if (ID_SET.has(key)) {
      next[key] = (next[key] ?? 0) + qty;
      continue;
    }
    const id = LEGACY_TO_ID.get(key);
    if (id) {
      next[id] = (next[id] ?? 0) + qty;
    }
    changed = true;
  }
  return { items: next, changed };
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        const migrated = migrate(parsed as Record<string, unknown>);
        items = migrated.items;
        if (migrated.changed) persist();
      }
    }
  } catch {
    // Storage can be unavailable (private mode, blocked cookies) — ignore.
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore write failures; the in-memory list still works for this session.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

export function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): SelectionItems {
  ensureLoaded();
  return items;
}

export function getServerSnapshot(): SelectionItems {
  // No storage on the server — start empty so hydration matches.
  return EMPTY;
}

export function setQuantity(key: string, quantity: number) {
  const next: SelectionItems = { ...items };
  if (quantity <= 0) {
    delete next[key];
  } else {
    next[key] = quantity;
  }
  items = next;
  persist();
  emit();
}

export function addOne(key: string) {
  setQuantity(key, (items[key] ?? 0) + 1);
}

export function removeOne(key: string) {
  setQuantity(key, (items[key] ?? 0) - 1);
}

export function clearSelection() {
  items = {};
  persist();
  emit();
}

const MAX_QTY = 99;
const MAX_TOKENS = 100;

export function serializeSelection(source: SelectionItems): string {
  return Object.entries(source)
    .filter(([id, qty]) => ID_SET.has(id) && qty > 0)
    .map(([id, qty]) =>
      qty === 1 ? id : `${id}x${Math.min(qty, MAX_QTY)}`
    )
    .join(",");
}

export function parseSelection(param: string): SelectionItems {
  const next: SelectionItems = {};
  for (const token of param.split(",").slice(0, MAX_TOKENS)) {
    const match = token.match(/^([a-z0-9]+?)(?:x(\d+))?$/);
    if (!match) continue;
    const id = match[1];
    if (!ID_SET.has(id)) continue;
    const qty = match[2] ? Math.min(parseInt(match[2], 10), MAX_QTY) : 1;
    if (qty > 0) next[id] = qty;
  }
  return next;
}

export function replaceSelection(next: SelectionItems) {
  ensureLoaded();
  items = { ...next };
  persist();
  emit();
}

export function mergeSelection(extra: SelectionItems) {
  ensureLoaded();
  const next = { ...items };
  for (const [id, qty] of Object.entries(extra)) {
    if (qty > 0) next[id] = Math.min((next[id] ?? 0) + qty, MAX_QTY);
  }
  items = next;
  persist();
  emit();
}
