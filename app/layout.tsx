import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, IBM_Plex_Mono, Instrument_Serif, Syne } from "next/font/google";
import { LanguageProvider } from "./components/LanguageProvider";
import { PortfolioShell } from "./components/PortfolioShell";
import { siteConfig } from "./site.config";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.meta.title,
    template: `%s · ${siteConfig.name}`,
  },
  applicationName: siteConfig.name,
  description: siteConfig.meta.description,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#05070c",
};

const LANG_BOOT_SCRIPT = `(function(){try{document.documentElement.lang="en";document.documentElement.dataset.lang="en";localStorage.setItem("apex-lang","en");}catch(e){document.documentElement.lang="en";document.documentElement.dataset.lang="en";}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${syne.variable} ${plex.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=panchang@700,800&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: LANG_BOOT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <PortfolioShell>{children}</PortfolioShell>
        </LanguageProvider>
      </body>
    </html>
  );
}
