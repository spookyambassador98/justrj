import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "public", "showcase-images", "lead-desk", "en");
const BASE = "http://127.0.0.1:3010";
const CODE = "crabonly26";
const VP = { width: 1440, height: 900 };

const MAP = [
  ["Стартапы без сайта", "Startups no site"],
  ["Рынок", "Market"],
  ["Образование", "Education"],
  ["Заводы", "Factories"],
  ["Медицина", "Medicine"],
  ["Домсервис", "Home service"],
  ["Отели", "Hotels"],
  ["Космос", "Space"],
  ["Бьюти", "Beauty"],
  ["Автосервис", "Auto service"],
  ["Магазины", "Shops"],
  ["Еда", "Food"],
  ["Другое", "Other"],
];

async function enJobs(page) {
  await page.evaluate((pairs) => {
    const walk = (node) => {
      if (node.nodeType === 3) {
        let t = node.nodeValue || "";
        for (const [from, to] of pairs) if (t.includes(from)) t = t.split(from).join(to);
        node.nodeValue = t;
        return;
      }
      if (node.nodeType === 1) {
        if (node.tagName === "SCRIPT" || node.tagName === "STYLE") return;
        for (const c of [...node.childNodes]) walk(c);
      }
    };
    walk(document.body);
  }, MAP);
}

async function shot(page, name) {
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const rail = document.querySelector(".side-rail, aside, [data-tour='sidebar']");
    if (rail) rail.scrollTop = 0;
    document.querySelectorAll(".tour-root,.tour-dim,.tour-open-btn").forEach((n) => {
      n.style.visibility = "hidden";
    });
  });
  await enJobs(page);
  await page.waitForTimeout(200);
  await page.screenshot({
    path: path.join(OUT, name),
    type: "jpeg",
    quality: 86,
    animations: "disabled",
    caret: "hide",
  });
  console.log("✓", name);
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
await page.waitForTimeout(2200);
const input = page.locator('input[type="password"]').first();
if (await input.count()) {
  await input.fill(CODE);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(1800);
}
await page.evaluate(() => {
  [...document.querySelectorAll("button")]
    .find((b) => (b.textContent || "").trim() === "EN")
    ?.click();
});
await page.waitForTimeout(400);
await page.waitForSelector("text=Daily queue", { timeout: 30000 });

for (const [nav, file] of [
  ["jobs", "parser-viewport.jpg"],
  ["admin", "admin-viewport.jpg"],
  ["exports", "exports-viewport.jpg"],
  ["queue", "queue-viewport.jpg"],
]) {
  await page.locator(`[data-nav="${nav}"]`).first().click({ force: true });
  await page.waitForTimeout(1100);
  await shot(page, file);
}

// Beauty
await page.locator('[data-nav="queue"]').first().click({ force: true });
await page.waitForTimeout(500);
await page.evaluate(() => {
  const el = [...document.querySelectorAll("button")].find((n) =>
    [...n.querySelectorAll("span")].some((s) => (s.textContent || "").trim() === "Beauty"),
  );
  el?.click();
});
await page.waitForTimeout(900);
await shot(page, "beauty-viewport.jpg");

await browser.close();
console.log("POLISH DONE");
