"use client";

import { categories, menu, site } from "@/data/menu";
import { ListTip } from "@/components/restaurant/list-hint";
import { MenuBrowser } from "@/components/restaurant/menu-browser";
import { SavedListsButton } from "@/components/restaurant/saved-lists";
import { ReviewCallout } from "@/components/restaurant/review-callout";
import { SpiceNotice } from "@/components/restaurant/spice";

/**
 * The interactive part of the page: search, category filters, the filtered
 * menu and the personal pick list. It lives in a Client Component so the
 * `MenuBrowser.*` compound API resolves inside the client module graph — a
 * Server Component would only see a module reference and its sub-components
 * would be `undefined`.
 */
export function MenuExperience() {
  return (
    <MenuBrowser sections={menu} categories={categories}>
        {/* Toolbar */}
        <div className="border-b border-border bg-card/20">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <MenuBrowser.Search
                placeholder={site.searchPlaceholder}
                className="w-full md:max-w-sm"
              />
              <MenuBrowser.Filters />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <MenuBrowser.Stats />
                <SavedListsButton />
              </div>
              <div className="flex flex-col items-start gap-1 sm:items-end">
                <MenuBrowser.Legend label={site.legend} info={site.legendInfo} />
                <SpiceNotice />
              </div>
            </div>
          </div>
        </div>

        {/* Menu + review */}
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
          <ListTip />
          <MenuBrowser.Results />

          <p className="mt-12 text-xs text-muted-foreground italic">
            {site.allergyNote}
          </p>

          <div className="mt-10">
            <ReviewCallout
              title={site.review.title}
              body={site.review.body}
              cta={site.review.cta}
            />
          </div>
        </main>
      </MenuBrowser>
  );
}
