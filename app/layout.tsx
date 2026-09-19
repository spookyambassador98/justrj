import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import {
  Big_Shoulders,
  Big_Shoulders_Stencil,
  Fraunces,
  Geist,
  IBM_Plex_Mono,
} from "next/font/google";
import { LanguageProvider } from "./components/LanguageProvider";
import { PortfolioShell } from "./components/PortfolioShell";
import { siteConfig } from "./site.config";
import "./globals.css";

// Self-hosted via next/font — no runtime CDN dependency (the previous
// Fontshare <link> could silently fail and fall back to system UI type,
// which is exactly what read as "wrong font" against the neural field).
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

// Display: tall condensed American Gothic grotesk — reads as engineered
// signage, not a generic template headline face.
const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-shoulders",
  display: "swap",
});

// Identity marks only (hero cut-out, footer wordmark): a literal stencil
// face — the letterforms already have gaps, so "the network shows through
// the name" is real typography, not a blend-mode trick.
const bigShouldersStencil = Big_Shoulders_Stencil({
  subsets: ["latin"],
  weight: "variable",
  variable: "--font-big-stencil",
  display: "swap",
});

// Accent serif: inky, wonky italic — the organic counterweight to the
// stencil's industrial cut.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: "variable",
  style: ["italic", "normal"],
  axes: ["opsz", "SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
});

const plex = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex",
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
      className={`${geist.variable} ${bigShoulders.variable} ${bigShouldersStencil.variable} ${fraunces.variable} ${plex.variable}`}
      suppressHydrationWarning
    >
      <head>
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
