"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { site } from "@/data/menu";

const STORAGE_KEY = "cherry-woken:list-tip-dismissed";

export function ListTip() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      dismissed = false;
    }
    if (!dismissed) queueMicrotask(() => setVisible(true));
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      return;
    }
  }

  return (
    <div className="relative mb-8 flex items-start gap-4 rounded-xl border border-border bg-card p-4 sm:p-5">
      <span className="mt-0.5 hidden size-9 shrink-0 items-center justify-center rounded-full border border-gold/60 text-gold sm:flex">
        <Plus className="size-4" />
      </span>
      <div className="pr-6">
        <p className="text-sm font-medium">{site.listTip.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
          {site.listTip.body}
        </p>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label={site.listTip.dismiss}
        className="absolute top-3 right-3 text-muted-foreground transition-colors hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
