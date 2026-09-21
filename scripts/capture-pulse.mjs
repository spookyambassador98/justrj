import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/showcase-images");
const VIEWPORT = { width: 1920, height: 1080 };
const PULSE = "https://pulse-beryl-one.vercel.app";

async function shot(page, name) {
  const dir = path.join(ROOT, "pulse", "en");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("saved", file);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: VIEWPORT, locale: "en-US" });

await page.goto(PULSE, { waitUntil: "domcontentloaded", timeout: 90000 });
await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
await page.locator(".release-title").waitFor({ timeout: 15000 });
await page.waitForTimeout(1800);
await shot(page, "hero-viewport.png");

const board = page.locator(".release-board");
if (await board.count()) {
  await board.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await shot(page, "monitor-viewport.png");
}

const facts = page.locator(".release-facts");
if (await facts.count()) {
  await facts.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await shot(page, "trace-viewport.png");
}

const windows = page.locator(".release-windows");
if (await windows.count()) {
  await windows.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await shot(page, "diagnosis-viewport.png");
}

const plate = page.locator(".release-plate");
if (await plate.count()) {
  await plate.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await shot(page, "compare-viewport.png");
}

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(700);
await shot(page, "readout-viewport.png");

await browser.close();
console.log("pulse shots done");
