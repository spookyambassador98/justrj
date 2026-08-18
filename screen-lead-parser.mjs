import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "public", "showcase-images", "lead-desk", "en");
const CODE = "crabonly26";
const VP = { width: 1440, height: 900 };

const MAP = [
  ["СВЯЗЬ STABLE", "LINK STABLE"],
  ["основатель", "founder"],
  ["Командование", "Command"],
  ["Очередь дня", "Daily queue"],
  ["Соцсети найдены", "Socials found"],
  ["Просмотрено · 7д", "Viewed · 7d"],
  ["РЫНКИ", "MARKETS"],
  ["Рынки", "Markets"],
  ["Еда", "Food"],
  ["Магазины", "Shops"],
  ["Автосервис", "Auto service"],
  ["Бьюти", "Beauty"],
  ["Медицина", "Medicine"],
  ["Отели", "Hotels"],
  ["Домсервис", "Home service"],
  ["Образование", "Education"],
  ["Заводы", "Factories"],
  ["Космос", "Space"],
  ["Другое", "Other"],
  ["СТАРТАПЫ", "STARTUPS"],
  ["Стартапы", "Startups"],
  ["Есть сайт", "Has website"],
  ["Нет сайта", "No website"],
  ["СЛОЙ ОПЕРАЦИЙ APEX", "APEX OPS LAYER"],
  ["Слой операций APEX", "APEX OPS LAYER"],
  ["ПАРС-ЗАДАЧИ // ДОБЫЧА", "PARSER JOBS // HARVEST"],
  ["Парс-задачи // Добыча", "Parser jobs // Harvest"],
  ["АДМИНКА // МОНИТОР", "ADMIN // MONITOR"],
  ["Админка // Монитор", "Admin // Monitor"],
  ["общее", "total"],
  ["целей", "targets"],
  ["заводов", "factories"],
  ["Админка", "Admin"],
  ["Парс-задачи", "Parser jobs"],
  ["Экспорт", "Exports"],
  ["Отчёты", "Reports"],
  ["Пройти тур", "Take tour"],
  ["Рынок", "Market"],
  ["без сайта", "no site"],
  ["ПОСЛЕДНИЕ PARSE JOBS", "LATEST PARSE JOBS"],
];

async function freeze(page) {
  await page.evaluate((pairs) => {
    const apply = () => {
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
      document.querySelectorAll(".tour-root,.tour-dim,.tour-open-btn").forEach((n) => {
        n.style.display = "none";
      });
    };
    apply();
    if (window.__obs) window.__obs.disconnect();
    window.__obs = new MutationObserver(() => apply());
    window.__obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }, MAP);
}

async function clickLabel(page, label) {
  await page.evaluate((label) => {
    const el = [...document.querySelectorAll("button")].find((n) =>
      [...n.querySelectorAll("span")].some((s) => (s.textContent || "").trim() === label),
    );
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.click();
    }
  }, label);
  await page.waitForTimeout(1100);
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: VP, colorScheme: "dark" });
await page.addInitScript(() => {
  try {
    localStorage.setItem("lead_desk_onboarding_seen_v2", "1");
    sessionStorage.setItem("apex-desk-unlocked", "1");
  } catch {}
});
await page.goto("https://lead-desk-eta.vercel.app", {
  waitUntil: "domcontentloaded",
  timeout: 90000,
});
await page.waitForTimeout(2000);
const input = page.locator('input[type="password"]').first();
if (await input.count()) {
  await input.fill(CODE);
  await page.locator('button[type="submit"]').first().click();
  await page.waitForTimeout(1800);
}

await clickLabel(page, "Парс-задачи");
await freeze(page);
await page.waitForTimeout(400);
await page.screenshot({
  path: path.join(OUT, "parser-viewport.jpg"),
  type: "jpeg",
  quality: 86,
  animations: "disabled",
  caret: "hide",
});
console.log("parser ok");

await clickLabel(page, "Админка");
await page.waitForTimeout(500);
await page.screenshot({
  path: path.join(OUT, "admin-viewport.jpg"),
  type: "jpeg",
  quality: 86,
  animations: "disabled",
  caret: "hide",
});
console.log("admin ok");
await browser.close();
