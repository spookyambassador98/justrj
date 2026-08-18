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

const LANG_BOOT_SCRIPT = `(function(){try{var k="apex-lang";var s=localStorage.getItem(k);if(s==="en"||s==="ru"||s==="uk"){document.documentElement.lang=s==="uk"?"uk":s;document.documentElement.dataset.lang=s;return;}var list=[].concat(navigator.languages||[],[navigator.language||""]);var uk=/^(uk)([-_]|$)/i;var ru=/^(ru|be|kk|ky|uz|tg|tk|hy|az|ka)([-_]|$)/i;var pick=null;for(var i=0;i<list.length;i++){var l=String(list[i]||"").toLowerCase();if(uk.test(l)){pick="uk";break;}if(ru.test(l)){pick="ru";break;}if(l.indexOf("en")===0){pick="en";break;}}if(!pick){try{var tz=Intl.DateTimeFormat().resolvedOptions().timeZone||"";if(/(Kyiv|Kiev|Europe\\/Kyiv)/i.test(tz))pick="uk";else if(/(Moscow|Minsk|Almaty|Tashkent|Yekaterinburg|Novosibirsk|Vladivostok|Kaliningrad|Samara|Volgograd|Baku|Yerevan|Tbilisi|Ashgabat|Bishkek|Dushanbe|Chisinau|Simferopol)/i.test(tz))pick="ru";}catch(e){}}if(!pick)pick="en";document.documentElement.lang=pick==="uk"?"uk":pick;document.documentElement.dataset.lang=pick;}catch(e){document.documentElement.lang="en";document.documentElement.dataset.lang="en";}})();`;

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
