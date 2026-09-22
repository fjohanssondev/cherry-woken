"use client";

import * as React from "react";
import { Bookmark, Pencil, Trash2 } from "lucide-react";

import { getSnapshot as getSelection, replaceSelection } from "@/lib/selection-store";
import {
  deleteList,
  getServerSnapshot,
  getSnapshot,
  renameList,
  saveList,
  subscribe,
  type SavedList,
} from "@/lib/saved-lists-store";
import { resolveSelection } from "@/lib/selection-resolve";
import { ShareButton } from "@/components/restaurant/share";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

function useSavedLists() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

function defaultName() {
  const date = new Date().toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
  return `Lista ${date}`;
}

export function SaveListButton() {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");

  function openDialog() {
    setName(defaultName());
    setOpen(true);
  }

  function save() {
    if (!name.trim()) return;
    saveList(name, getSelection());
    setOpen(false);
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={openDialog}>
        <Bookmark className="size-4" />
        Spara
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Spara lista</DialogTitle>
            <DialogDescription>
              Ge listan ett namn så hittar du tillbaka till den. Sparas bara i
              den här webbläsaren – dela en länk om du vill nå den på en annan
              enhet.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Namn på listan"
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") save();
            }}
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={save} disabled={!name.trim()}>
              Spara
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function SavedListsButton() {
  const lists = useSavedLists();
  const [open, setOpen] = React.useState(false);

  if (lists.length === 0) return null;

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Bookmark className="size-4" />
        Sparade listor ({lists.length})
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sparade listor</DialogTitle>
          </DialogHeader>
          <ul className="max-h-[50vh] space-y-3 overflow-y-auto">
            {lists.map((list) => (
              <SavedListRow
                key={list.id}
                list={list}
                onLoaded={() => setOpen(false)}
              />
            ))}
          </ul>
          <p className="text-xs text-muted-foreground">
            Sparas bara i den här webbläsaren.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}

function SavedListRow({
  list,
  onLoaded,
}: {
  list: SavedList;
  onLoaded: () => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [name, setName] = React.useState(list.name);
  const { count, total } = resolveSelection(list.items);

  function load() {
    replaceSelection(list.items);
    onLoaded();
  }

  function commitRename() {
    if (!name.trim()) return;
    renameList(list.id, name);
    setEditing(false);
  }

  return (
    <li className="rounded-lg border border-border p-3">
      {editing ? (
        <div className="flex items-center gap-2">
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoFocus
            onKeyDown={(event) => {
              if (event.key === "Enter") commitRename();
            }}
          />
          <Button size="sm" onClick={commitRename} disabled={!name.trim()}>
            Klar
          </Button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">{list.name}</span>
            <span className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {count} {count === 1 ? "rätt" : "rätter"} · {total}&nbsp;kr
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-1">
            <Button size="sm" onClick={load}>
              Ladda
            </Button>
            <ShareButton getItems={() => list.items} />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setName(list.name);
                setEditing(true);
              }}
            >
              <Pencil className="size-4" />
              Byt namn
            </Button>
            <Button variant="ghost" size="sm" onClick={() => deleteList(list.id)}>
              <Trash2 className="size-4" />
              Ta bort
            </Button>
          </div>
        </>
      )}
    </li>
  );
}
