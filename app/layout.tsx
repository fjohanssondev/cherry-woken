import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import { site } from "@/data/menu";
import { shouldIndex, siteUrl } from "@/lib/site";
import "./globals.css";

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
  description: site.tagline,
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
    description: site.tagline,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.tagline,
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
      </body>
    </html>
  );
}
