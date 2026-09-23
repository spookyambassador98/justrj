/**
 * Capture Freshrail showcase screenshots for the public Level 2 case.
 * English UI only — justrj serves one EN plate per language.
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = process.env.FRESHRAIL_BASE || "https://freshrail-pi.vercel.app";
const out = path.join(__dirname, "public", "showcase-images", "freshrail", "en");
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  colorScheme: "dark",
  deviceScaleFactor: 1,
});

await page.addInitScript(() => {
  try {
    sessionStorage.setItem("freshrail-booted-v2", "1");
  } catch {
    /* ignore */
  }
});

async function shot(name) {
  await page.addStyleTag({
    content: ".custom-cursor{display:none!important}",
  });
  await page.screenshot({
    path: path.join(out, name),
    type: "png",
    animations: "disabled",
    caret: "hide",
  });
  console.log("✓", name);
}

async function settle(ms) {
  await page.waitForTimeout(ms);
}

try {
  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.getByText("Morning", { exact: true }).first().waitFor({ timeout: 30000 });
  await settle(2400);
  await shot("hero-viewport.png");

  await page.evaluate(() => {
    const el = document.querySelector(".stats");
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 28;
    window.scrollTo(0, top);
  });
  await settle(700);
  await shot("stats-viewport.png");

  await page.evaluate(() => {
    document.querySelector("#it-shelf")?.scrollIntoView({ block: "start" });
  });
  await settle(600);
  const hotCards = await page.locator("#it-shelf ~ .sect .card, .sect .card").count();
  if (hotCards === 0) {
    const all = page.locator("#it-shelf").getByRole("button", { name: /^All/ });
    if (await all.count()) {
      await all.first().click();
      await settle(900);
    }
  }
  await page.locator(".card, .empty").first().waitFor({ timeout: 20000 }).catch(() => {});
  await settle(400);
  await shot("shelf-viewport.png");

  await page.goto(BASE + "/?profile=online", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.getByText("no-exp", { exact: false }).first().waitFor({ timeout: 30000 });
  await settle(2200);
  await shot("online-viewport.png");

  await page.evaluate(() => {
    document.querySelector("#online-shelf")?.scrollIntoView({ block: "start" });
  });
  await settle(700);
  await shot("online-shelf-viewport.png");

  await page.goto(BASE + "/?profile=medical", {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.getByText("desk", { exact: false }).first().waitFor({ timeout: 30000 });
  await settle(2200);
  await shot("medical-viewport.png");

  console.log("FRESHRAIL captures done");
} finally {
  await browser.close();
}
