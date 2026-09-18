/**
 * A tiny external store for the visitor's personal pick list (which dishes and
 * how many). It lives outside React so any component can read or update it
 * without a provider, and it mirrors itself to localStorage so the list
 * survives a reload. Read it from components with `useSyncExternalStore`.
 */

export type SelectionItems = Record<string, number>;

const STORAGE_KEY = "cherry-woken:selection";
const EMPTY: SelectionItems = Object.freeze({});

let items: SelectionItems = {};
let loaded = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (loaded) return;
  loaded = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        items = parsed as SelectionItems;
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
