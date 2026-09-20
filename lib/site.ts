/**
 * Canonical, absolute site URL used for metadata, robots and the sitemap.
 *
 * Resolution order:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override (any environment).
 *   2. On Vercel previews (e.g. the `dev` branch) — the deployment's own URL,
 *      so canonical/OG/sitemap point at that preview instead of production.
 *   3. Production default.
 *
 * These VERCEL_* vars are server-only; `siteUrl` is only used in Server
 * Components, robots.ts and sitemap.ts, never shipped to the client.
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (process.env.VERCEL_ENV === "preview") {
    const host = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL;
    if (host) return `https://${host}`;
  }
  return "https://cherrywoken.se";
}

export const siteUrl = resolveSiteUrl().replace(/\/+$/, "");

/**
 * Only the real production deployment should be indexed. Previews (dev branch,
 * PRs) and their custom domains must stay out of Google. Locally (no VERCEL_ENV)
 * we treat it as production — it isn't crawlable anyway.
 */
export const shouldIndex =
  process.env.VERCEL_ENV === "production" || process.env.VERCEL_ENV === undefined;

export const isProduction = process.env.VERCEL_ENV === "production";
