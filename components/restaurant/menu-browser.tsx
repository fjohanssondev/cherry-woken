"use client";

import * as React from "react";
import { Search as SearchIcon } from "lucide-react";

import type { Category, CategoryId, Dish as DishType, MenuSection } from "@/data/menu";
import { countDishes, filterMenu } from "@/lib/menu";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { Dish, Section } from "@/components/restaurant/menu";
import { DishSelector, dishKey } from "@/components/restaurant/selection";
import {
  SpiceLegend,
  SpiceRating,
  resolveSpiceLevel,
  useSpiceAggregates,
} from "@/components/restaurant/spice";

/* -------------------------------------------------------------------------- */
/* Context                                                                     */
/* -------------------------------------------------------------------------- */

type MenuBrowserContextValue = {
  categories: Category[];
  category: CategoryId;
  setCategory: (id: CategoryId) => void;
  query: string;
  setQuery: (value: string) => void;
  results: MenuSection[];
  total: number;
  visible: number;
};

const MenuBrowserContext =
  React.createContext<MenuBrowserContextValue | null>(null);

function useMenuBrowser() {
  const context = React.useContext(MenuBrowserContext);
  if (!context) {
    throw new Error("MenuBrowser.* must be used inside <MenuBrowser>");
  }
  return context;
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                    */
/* -------------------------------------------------------------------------- */

function MenuBrowser({
  sections,
  categories,
  children,
}: {
  sections: MenuSection[];
  categories: Category[];
  children: React.ReactNode;
}) {
  const [category, setCategory] = React.useState<CategoryId>("allt");
  const [query, setQuery] = React.useState("");
  const aggregates = useSpiceAggregates();

  const total = React.useMemo(() => countDishes(sections), [sections]);
  const results = React.useMemo(
    () =>
      filterMenu(sections, category, query, (dish: DishType) =>
        resolveSpiceLevel(dish, aggregates)
      ),
    [sections, category, query, aggregates]
  );
  const visible = React.useMemo(() => countDishes(results), [results]);

  const value: MenuBrowserContextValue = {
    categories,
    category,
    setCategory,
    query,
    setQuery,
    results,
    total,
    visible,
  };

  return (
    <MenuBrowserContext.Provider value={value}>
      {children}
    </MenuBrowserContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */
/* Search                                                                      */
/* -------------------------------------------------------------------------- */

function BrowserSearch({
  placeholder,
  className,
}: {
  placeholder?: string;
  className?: string;
}) {
  const { query, setQuery } = useMenuBrowser();
  return (
    <div className={cn("relative", className)}>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder ?? "Sök"}
        className="h-10 bg-card pl-9"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Filters                                                                     */
/* -------------------------------------------------------------------------- */

function BrowserFilters({ className }: { className?: string }) {
  const { categories, category, setCategory } = useMenuBrowser();
  return (
    <div
      role="group"
      aria-label="Filtrera menyn"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {categories.map((item) => {
        const active = item.id === category;
        return (
          <Button
            key={item.id}
            type="button"
            size="sm"
            variant={active ? "default" : "secondary"}
            aria-pressed={active}
            onClick={() => setCategory(item.id)}
          >
            {item.label}
          </Button>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stats + legend                                                              */
/* -------------------------------------------------------------------------- */

function BrowserStats({ className }: { className?: string }) {
  const { visible, total, category, query } = useMenuBrowser();
  const filtered = category !== "allt" || query.trim() !== "";
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {filtered ? (
        <>
          <span className="tabular-nums text-foreground">{visible}</span> av{" "}
          <span className="tabular-nums">{total}</span> rätter
        </>
      ) : (
        <>
          <span className="tabular-nums text-foreground">{total}</span> rätter och
          tillbehör på menyn
        </>
      )}
    </p>
  );
}

function BrowserLegend({
  label,
  info,
  className,
}: {
  label: string;
  info?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground",
        className
      )}
    >
      <SpiceLegend />
      {label}
      {info ? <InfoTooltip label="Om styrkebetygen" text={info} /> : null}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Results                                                                     */
/* -------------------------------------------------------------------------- */

function BrowserResults({ className }: { className?: string }) {
  const { results, setCategory, setQuery } = useMenuBrowser();

  if (results.length === 0) {
    return (
      <div className={cn("py-16 text-center", className)}>
        <p className="font-serif text-xl">Inga rätter matchar din sökning.</p>
        <Button
          variant="link"
          onClick={() => {
            setCategory("allt");
            setQuery("");
          }}
        >
          Rensa filter
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2",
        className
      )}
    >
      {results.map((section) => (
        <Section key={section.id} span={section.span}>
          <Section.Header title={section.title} chinese={section.chinese} />
          <Section.List columns={section.span === "full"}>
            {section.dishes.map((dish) => (
              <Dish key={dishKey(dish)}>
                <Dish.Marker>{dish.no}</Dish.Marker>
                <Dish.Content>
                  <Dish.Line>
                    <Dish.Title>{dish.name}</Dish.Title>
                    <Dish.Leader />
                    <Dish.Price>{dish.price}</Dish.Price>
                  </Dish.Line>
                  {dish.description ? (
                    <Dish.Note>{dish.description}</Dish.Note>
                  ) : null}
                  <SpiceRating dish={dish} />
                </Dish.Content>
                <Dish.Action>
                  <DishSelector dish={dish} />
                </Dish.Action>
              </Dish>
            ))}
          </Section.List>
        </Section>
      ))}
    </div>
  );
}

MenuBrowser.Search = BrowserSearch;
MenuBrowser.Filters = BrowserFilters;
MenuBrowser.Stats = BrowserStats;
MenuBrowser.Legend = BrowserLegend;
MenuBrowser.Results = BrowserResults;

export { MenuBrowser };
