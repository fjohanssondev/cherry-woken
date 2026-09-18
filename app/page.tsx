import { site } from "@/data/menu";
import { siteUrl } from "@/lib/site";
import { telHref } from "@/lib/utils";
import { MenuExperience } from "@/components/restaurant/menu-experience";
import { OrderSummary } from "@/components/restaurant/selection";
import { SiteFooter } from "@/components/restaurant/site-footer";
import { SiteHeader } from "@/components/restaurant/site-header";
import { ThemeToggle } from "@/components/theme-toggle";

// Structured data describing the website itself (not the restaurant business —
// this is an independent, unofficial menu site, per the footer disclaimer).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: siteUrl,
  description: site.tagline,
  inLanguage: "sv-SE",
};

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header band */}
      <header className="border-b border-border bg-card/30">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <div className="mb-8 flex justify-end">
            <ThemeToggle />
          </div>
          <SiteHeader>
            <SiteHeader.Brand
              kicker={site.kicker}
              name={site.name}
              tagline={site.tagline}
            />
            <SiteHeader.Lantern />
            <SiteHeader.Info
              groups={[
                {
                  label: site.hours.label,
                  lines: [site.hours.weekday, site.hours.weekend],
                },
                {
                  label: site.order.label,
                  lines: [
                    {
                      text: site.order.phone,
                      href: telHref(site.order.phone),
                    },
                    site.order.address,
                  ],
                },
              ]}
            />
          </SiteHeader>
        </div>
      </header>

      {/* Interactive menu (search, filters, dishes) */}
      <MenuExperience />

      <SiteFooter />

      {/* Sticky pick-list bar; rendered last so its spacer reserves room below
          the footer instead of covering it. */}
      <OrderSummary />
    </div>
  );
}
