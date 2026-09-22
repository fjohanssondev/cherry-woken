import type { SelectionItems } from "@/lib/selection-store";

export type SavedList = {
  id: string;
  name: string;
  items: SelectionItems;
  createdAt: number;
};

const STORAGE_KEY = "cherry-woken:lists";
const EMPTY: SavedList[] = [];

let lists: SavedList[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function isSavedList(value: unknown): value is SavedList {
  if (!value || typeof value !== "object") return false;
  const list = value as SavedList;
  return (
    typeof list.id === "string" &&
    typeof list.name === "string" &&
    typeof list.createdAt === "number" &&
    Boolean(list.items) &&
    typeof list.items === "object"
  );
}

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) lists = parsed.filter(isSavedList);
    }
  } catch {
    return;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
  } catch {
    return;
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `l-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  }
}

export function subscribe(listener: () => void) {
  ensureLoaded();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getSnapshot(): SavedList[] {
  ensureLoaded();
  return lists;
}

export function getServerSnapshot(): SavedList[] {
  return EMPTY;
}

export function saveList(name: string, items: SelectionItems) {
  ensureLoaded();
  const entry: SavedList = {
    id: newId(),
    name: name.trim() || "Min lista",
    items: { ...items },
    createdAt: Date.now(),
  };
  lists = [entry, ...lists];
  persist();
  emit();
}

export function renameList(id: string, name: string) {
  ensureLoaded();
  const trimmed = name.trim();
  if (!trimmed) return;
  lists = lists.map((list) =>
    list.id === id ? { ...list, name: trimmed } : list
  );
  persist();
  emit();
}

export function deleteList(id: string) {
  ensureLoaded();
  lists = lists.filter((list) => list.id !== id);
  persist();
  emit();
}
