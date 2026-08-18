import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "public", "showcase-images", "lead-desk", "en");
const BASE = "http://127.0.0.1:3010";
const CODE = "crabonly26";
const VP = { width: 1440, height: 900 };

async function shot(page, name) {
  await page.evaluate(() => {
    document.querySelectorAll(".tour-root,.tour-dim,.tour-open-btn").forEach((n) => {
      /** @type {HTMLElement} */ (n).style.visibility = "hidden";
    });
  });
  await page.screenshot({
    path: path.join(OUT, name),
    type: "jpeg",
    quality: 86,
    animations: "disabled",
    caret: "hide",
  });
  console.log("✓", name);
}

async function waitTitle(page, re) {
  await page.waitForFunction(
    (reSrc) => {
      const t = document.body?.innerText || "";
      return new RegExp(reSrc, "i").test(t);
    },
    re,
    { timeout: 15000 },
  ).catch(() => {});
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: VP, colorScheme: "dark" });
await page.addInitScript(() => {
  try {
    localStorage.setItem("apex-locale", "en");
    localStorage.setItem("lead_desk_onboarding_seen_v2", "1");
    sessionStorage.setItem("apex-desk-unlocked", "1");
  } catch {}
});

await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
await page.waitForTimeout(2500);
const input = page.locator('input[type="password"]').first();
if (await input.count()) {
  await input.fill(CODE);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(2000);
}
await page.evaluate(() => {
  [...document.querySelectorAll("button")]
    .find((b) => (b.textContent || "").trim() === "EN")
    ?.click();
});
await page.waitForTimeout(400);

// Ensure desk loaded
await page.waitForSelector("text=Daily queue", { timeout: 30000 });

for (const [nav, file, titleRe] of [
  ["queue", "queue-viewport.jpg", "PRIORITY TARGETS|Daily queue"],
  ["jobs", "parser-viewport.jpg", "HARVEST|Parser jobs"],
  ["admin", "admin-viewport.jpg", "MONITOR|Admin"],
  ["exports", "exports-viewport.jpg", "DOWNLOAD|Exports"],
]) {
  const btn = page.locator(`[data-nav="${nav}"]`).first();
  if (await btn.count()) {
    await btn.scrollIntoViewIfNeeded();
    await btn.click({ force: true });
  } else {
    console.warn("missing data-nav", nav);
  }
  await page.waitForTimeout(1200);
  await waitTitle(page, titleRe);
  await shot(page, file);
}

// Beauty lane
const beauty = page.locator("button").filter({ hasText: /^Beauty$/ }).first();
await page.locator('[data-nav="queue"]').click({ force: true }).catch(() => {});
await page.waitForTimeout(600);
if (await beauty.count()) {
  await beauty.click({ force: true });
  await page.waitForTimeout(900);
  await shot(page, "beauty-viewport.jpg");
}

await browser.close();
console.log("LOCAL OPS DONE");
