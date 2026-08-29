import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Geist, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { LanguageProvider } from "./components/LanguageProvider";
import { PortfolioShell } from "./components/PortfolioShell";
import { siteConfig } from "./site.config";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
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
  themeColor: "#020202",
};

const LANG_BOOT_SCRIPT = `(function(){try{document.documentElement.lang="en";document.documentElement.dataset.lang="en";localStorage.setItem("apex-lang","en");}catch(e){document.documentElement.lang="en";document.documentElement.dataset.lang="en";}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${jakarta.variable} ${instrument.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@500,600,700&display=swap"
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
