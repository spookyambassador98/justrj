/**
 * Capture DRIFT showcase screenshots for portfolio (uk / en / ru).
 * Requires drift-pro.vercel.app with ru locale deployed.
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.DRIFT_BASE || "https://drift-pro.vercel.app";
const VP = { width: 1440, height: 900 };
const LOCALE_KEY = "drift-locale";
const INTRO_MS = 2600;

const LOCALES = [
  { folder: "uk", locale: "uk" },
  { folder: "en", locale: "en" },
  { folder: "ru", locale: "ru" },
];

const VIEWS = [
  { file: "hero-viewport.jpg", path: "/", wait: INTRO_MS + 400 },
  { file: "catalog-viewport.jpg", path: "/#cars", wait: 1200 },
  { file: "detail-viewport.jpg", path: "/cars/golf-2018", wait: 1400 },
  { file: "order-viewport.jpg", path: "/order", wait: 1000 },
  { file: "sell-viewport.jpg", path: "/sell", wait: 1000 },
  { file: "how-viewport.jpg", path: "/how", wait: 1000 },
  { file: "owner-viewport.jpg", path: "/owner", wait: 1000 },
];

async function dismissIntro(page) {
  await page.waitForTimeout(INTRO_MS);
}

async function captureLocale(browser, { folder, locale }) {
  const out = path.join(__dirname, "public", "showcase-images", "drift", folder);
  fs.mkdirSync(out, { recursive: true });

  const page = await browser.newPage({ viewport: VP, colorScheme: "dark" });
  await page.addInitScript(
    ({ key, value }) => {
      try {
        localStorage.setItem(key, value);
      } catch {}
    },
    { key: LOCALE_KEY, value: locale },
  );

  for (const view of VIEWS) {
    await page.goto(`${BASE}${view.path}`, {
      waitUntil: "domcontentloaded",
      timeout: 90000,
    });
    if (view.path === "/") await dismissIntro(page);
    else await page.waitForTimeout(view.wait);
    await page.screenshot({
      path: path.join(out, view.file),
      type: "jpeg",
      quality: 86,
      fullPage: false,
      animations: "disabled",
      caret: "hide",
    });
    console.log(`✓ drift/${folder}/${view.file}`);
  }

  await page.close();
}

const browser = await chromium.launch({ headless: true });
try {
  for (const loc of LOCALES) {
    await captureLocale(browser, loc);
  }
  console.log("DRIFT captures done");
} finally {
  await browser.close();
}
