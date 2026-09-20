import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/data/menu";
import { isProduction, shouldIndex, siteUrl } from "@/lib/site";
import "./globals.css";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const title = `${site.name} · ${site.kicker}`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description: site.metaDescription,
  applicationName: site.name,
  keywords: [
    "Cherry Woken",
    "thairestaurang Sundsvall",
    "kinesisk restaurang Sundsvall",
    "meny",
    "hämtmat",
    "avhämtning",
    "wok",
    "thailändskt kök",
    "kinesiskt kök",
  ],
  authors: [{ name: site.disclaimer.author }],
  creator: site.disclaimer.author,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: shouldIndex,
    follow: shouldIndex,
    googleBot: { index: shouldIndex, follow: shouldIndex },
  },
  openGraph: {
    type: "website",
    locale: "sv_SE",
    url: siteUrl,
    siteName: site.name,
    title,
    description: site.metaDescription,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.metaDescription,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sv"
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          value={{ light: "light", dark: "dark" }}
        >
          {children}
        </ThemeProvider>
        {isProduction ? (
          <Script
            strategy="beforeInteractive"
            src="https://cloud.umami.is/script.js"
            data-website-id="e0b6fed2-5982-427a-98fb-358abf64449d"
          />
        ) : null}
      </body>
    </html>
  );
}
