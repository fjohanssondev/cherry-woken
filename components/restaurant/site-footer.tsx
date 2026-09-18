import { site } from "@/data/menu";
import { telHref } from "@/lib/utils";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
            {site.takeaway.label}
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {site.takeaway.body}
          </p>
        </div>

        <div>
          <p className="text-[0.7rem] font-medium tracking-[0.15em] text-muted-foreground uppercase">
            {site.find.label}
          </p>
          <address className="mt-3 space-y-1 text-sm not-italic">
            <a
              href={telHref(site.find.phone)}
              className="text-primary hover:underline"
            >
              {site.find.phone}
            </a>
            <p>{site.find.address}</p>
            <p>
              {site.find.postal} {site.find.city}
            </p>
          </address>
        </div>

        <div className="sm:col-span-2 sm:text-right lg:col-span-1">
          <p className="font-serif text-3xl text-primary">{site.logogram}</p>
          <p className="mt-2 text-xs tracking-[0.15em] text-muted-foreground uppercase">
            {site.priceNote}
          </p>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-6 text-xs leading-relaxed text-muted-foreground">
          <p className="max-w-xl">{site.disclaimer.text}</p>
          <p className="mt-1">
            {site.disclaimer.authorLabel}:{" "}
            <Link href="https://github.com/fjohanssondev" className="text-amber-200 hover:underline">{site.disclaimer.author}</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
