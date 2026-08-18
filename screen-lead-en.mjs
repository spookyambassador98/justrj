/**
 * Capture Lead Desk EN screenshots.
 * Queue/gate prefer local EN build; ops views fall back to production + EN chrome inject.
 */
import { chromium } from "playwright";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VP = { width: 1440, height: 900 };
const LOCAL = process.env.LEAD_BASE || "http://127.0.0.1:3010";
const PROD = "https://lead-desk-eta.vercel.app";
const CODE = process.env.LEAD_CODE || "crabonly26";
const OUT = path.join(__dirname, "public", "showcase-images", "lead-desk", "en");

fs.mkdirSync(OUT, { recursive: true });

const MAP = [
  ["СВЯЗЬ STABLE", "LINK STABLE"],
  ["Связь STABLE", "Link STABLE"],
  ["основатель", "founder"],
  ["Командование", "Command"],
  ["КОМАНДОВАНИЕ", "COMMAND"],
  ["Очередь дня", "Daily queue"],
  ["Соцсети найдены", "Socials found"],
  ["Просмотрено · 7д", "Viewed · 7d"],
  ["Просмотрено - 7д", "Viewed · 7d"],
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
  ["ОЧЕРЕДЬ ДНЯ // ПРИОРИТЕТНЫЕ ЦЕЛИ", "DAILY QUEUE // PRIORITY TARGETS"],
  ["Очередь дня // Приоритетные цели", "Daily queue // Priority targets"],
  ["ПРИОРИТЕТНЫЕ ЦЕЛИ", "PRIORITY TARGETS"],
  ["ПАРС-ЗАДАЧИ // ДОБЫЧА", "PARSER JOBS // HARVEST"],
  ["Парс-задачи // Добыча", "Parser jobs // Harvest"],
  ["АДМИНКА // МОНИТОР", "ADMIN // MONITOR"],
  ["Админка // Монитор", "Admin // Monitor"],
  ["ЭКСПОРТ // ВЫГРУЗКА", "EXPORTS // DOWNLOAD"],
  ["Экспорт // Выгрузка", "Exports // Download"],
  ["ОТЧЁТЫ ПАРСИНГА // РАЗВЕДКА", "PARSER REPORTS // INTEL"],
  ["общее", "total"],
  ["целей", "targets"],
  ["заводов", "factories"],
  ["Поиск компании / email", "Search company / email"],
  ["Все регионы", "All regions"],
  ["Все статусы", "All statuses"],
  ["Экспорт CSV", "Export CSV"],
  ["СКОР", "SCORE"],
  ["ЦЕЛЬ", "TARGET"],
  ["ИНФО", "INFO"],
  ["ОФФЕР", "OFFER"],
  ["ГЕО", "GEO"],
  ["СОЦСЕТИ", "SOCIAL"],
  ["СТАТУС", "STATUS"],
  ["Сайт", "Website"],
  ["Апгрейд", "Upgrade"],
  ["Портал завода", "Plant portal"],
  ["Платформа курсов", "Course platform"],
  ["ДОСТУП К СИСТЕМЕ", "SYSTEM ACCESS"],
  ["Доступ к системе", "System access"],
  ["Вставь код команды. Посторонним вход закрыт.", "Enter the team code. Outsiders stay out."],
  ["Войти →", "Enter →"],
  ["Войти", "Enter"],
  ["Проверка…", "Checking…"],
  ["Админка", "Admin"],
  ["Адмін", "Admin"],
  ["Парс-задачи", "Parser jobs"],
  ["Парсер", "Parser"],
  ["Экспорт", "Exports"],
  ["Експорт", "Exports"],
  ["Отчёты", "Reports"],
  ["Отчеты", "Reports"],
  ["Пройти тур", "Take tour"],
  ["Подсказки", "Tips"],
  ["СИСТЕМЫ ОНЛАЙН", "SYSTEMS ONLINE"],
  ["Рынок -", "Market -"],
  ["Рынок —", "Market —"],
  ["Стартапы без сайта -", "Startups no site -"],
  ["Стартапы без сайта —", "Startups no site —"],
  ["ПОСЛЕДНИЕ PARSE JOBS", "LATEST PARSE JOBS"],
  ["Лиды", "Leads"],
  ["Ещё", "More"],
];

async function enFreeze(page) {
  await page.evaluate((pairs) => {
    const apply = () => {
      const walk = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          let t = node.nodeValue || "";
          for (const [from, to] of pairs) {
            if (t.includes(from)) t = t.split(from).join(to);
          }
          if (t !== node.nodeValue) node.nodeValue = t;
          return;
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = /** @type {HTMLElement} */ (node);
          if (el.tagName === "SCRIPT" || el.tagName === "STYLE") return;
          if (el.placeholder) {
            let p = el.placeholder;
            for (const [from, to] of pairs) p = p.split(from).join(to);
            el.placeholder = p;
          }
          for (const child of [...node.childNodes]) walk(child);
        }
      };
      walk(document.body);
      document.querySelectorAll(".tour-root, .tour-dim, .tour-open-btn").forEach((n) => {
        /** @type {HTMLElement} */ (n).style.display = "none";
      });
    };
    apply();
    if (window.__enObs) window.__enObs.disconnect();
    const obs = new MutationObserver(() => apply());
    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    window.__enObs = obs;
  }, MAP);
  await page.waitForTimeout(250);
}

async function shot(page, name) {
  await enFreeze(page);
  await page.screenshot({
    path: path.join(OUT, name),
    type: "jpeg",
    quality: 86,
    fullPage: false,
    animations: "disabled",
    caret: "hide",
  });
  console.log("✓", name);
}

async function unlockProd(page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem("lead_desk_onboarding_seen_v2", "1");
      sessionStorage.setItem("apex-desk-unlocked", "1");
    } catch {}
  });
  await page.goto(PROD, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(2000);
  const input = page.locator('input[type="password"]').first();
  if (await input.count()) {
    await input.fill(CODE);
    const btn = page.locator('button[type="submit"]').first();
    if (await btn.count()) await btn.click();
    else await page.keyboard.press("Enter");
    await page.waitForTimeout(1600);
  }
  await page.waitForTimeout(800);
}

async function clickSpanLabel(page, label) {
  await page.evaluate((label) => {
    const nodes = [...document.querySelectorAll("button")];
    const el = nodes.find((n) =>
      [...n.querySelectorAll("span")].some(
        (s) => (s.textContent || "").trim() === label,
      ),
    );
    if (el) {
      el.scrollIntoView({ block: "center" });
      el.click();
    }
  }, label);
  await page.waitForTimeout(1000);
}

const browser = await chromium.launch({ headless: true });
try {
  // —— LOCAL EN gate + queue (native EN locale) ——
  const local = await browser.newPage({ viewport: VP, colorScheme: "dark" });
  await local.addInitScript(() => {
    try {
      localStorage.setItem("apex-locale", "en");
      localStorage.setItem("lead_desk_onboarding_seen_v2", "1");
      sessionStorage.removeItem("apex-desk-unlocked");
    } catch {}
  });
  try {
    await local.goto(LOCAL, { waitUntil: "domcontentloaded", timeout: 30000 });
    for (let i = 0; i < 25; i++) {
      if (await local.locator('input[type="password"]').count()) break;
      await local.waitForTimeout(350);
    }
    if (await local.locator('input[type="password"]').count()) {
      await shot(local, "gate-viewport.jpg");
    }
    // unlock for queue
    await local.evaluate(() => {
      sessionStorage.setItem("apex-desk-unlocked", "1");
    });
    await local.reload({ waitUntil: "domcontentloaded" });
    await local.waitForTimeout(2200);
    const inp = local.locator('input[type="password"]').first();
    if (await inp.count()) {
      await inp.fill(CODE);
      await local.locator('button[type="submit"]').first().click();
      await local.waitForTimeout(1600);
    }
    await local.evaluate(() => {
      [...document.querySelectorAll("button")]
        .find((b) => (b.textContent || "").trim() === "EN")
        ?.click();
    });
    await local.waitForTimeout(500);
    if (await local.locator("text=Daily queue").count()) {
      await shot(local, "queue-viewport.jpg");
      await clickSpanLabel(local, "Beauty");
      await shot(local, "beauty-viewport.jpg");
    }
  } catch (e) {
    console.warn("local capture skipped:", e.message);
  }
  await local.close();

  // —— PROD for parser / admin / exports (stable views + EN inject) ——
  const page = await browser.newPage({ viewport: VP, colorScheme: "dark" });
  await unlockProd(page);

  const views = [
    { file: "parser-viewport.jpg", labels: ["Парс-задачи", "Parser jobs"] },
    { file: "admin-viewport.jpg", labels: ["Админка", "Admin"] },
    { file: "exports-viewport.jpg", labels: ["Экспорт", "Exports"] },
  ];

  for (const v of views) {
    for (const label of v.labels) {
      await clickSpanLabel(page, label);
    }
    await page.waitForTimeout(800);
    await shot(page, v.file);
  }

  // If local beauty failed, take from prod too
  if (!fs.existsSync(path.join(OUT, "beauty-viewport.jpg"))) {
    await clickSpanLabel(page, "Бьюти");
    await shot(page, "beauty-viewport.jpg");
  }

  console.log("LEAD EN DONE");
} finally {
  await browser.close();
}
