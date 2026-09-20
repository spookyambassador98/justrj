import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../public/showcase-images");
const VIEWPORT = { width: 1920, height: 1080 };
const RADAR = "https://price-tracker-psi-red.vercel.app";
const MIDDOCS = "https://frontend-mauve-psi-fk8zi9x14v.vercel.app";
const MIDDOCS_API = "https://middocs-api.onrender.com";
const PULSE = "https://pulse-beryl-one.vercel.app";

async function shot(page, folder, name) {
  const dir = path.join(ROOT, folder, "en");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, name);
  await page.screenshot({ path: file, type: "png" });
  console.log("saved", file);
  return file;
}

async function gotoReady(page, url, extraWait = 1400) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForLoadState("networkidle", { timeout: 25000 }).catch(() => {});
  await page.waitForTimeout(extraWait);
}

async function waitForApi() {
  for (let i = 0; i < 24; i++) {
    try {
      const res = await fetch(`${MIDDOCS_API}/health`);
      if (res.ok) {
        const body = await res.json();
        if (body?.ok) {
          console.log("api ready", body);
          return;
        }
      }
    } catch {
      // still waking / rebuilding
    }
    console.log("waiting for api…", i + 1);
    await new Promise((r) => setTimeout(r, 5000));
  }
  throw new Error("middocs API did not come up");
}

async function fillByLabel(page, label, value) {
  const input = page.getByLabel(label, { exact: true });
  await input.fill(value);
}

const browser = await chromium.launch({ headless: true });

try {
  const skipRadar = process.argv.includes("--skip-radar");

  // ---------- Price Radar ----------
  if (!skipRadar) {
  const radar = await browser.newPage({ viewport: VIEWPORT, locale: "en-US" });
  await gotoReady(radar, RADAR, 1800);
  await shot(radar, "price-radar", "dashboard-viewport.png");
  const form = radar.locator(".add-form").first();
  if (await form.count()) {
    await form.scrollIntoViewIfNeeded();
    await radar.waitForTimeout(400);
    await shot(radar, "price-radar", "form-viewport.png");
  }
  const cards = radar.locator(".product-grid");
  if (await cards.count()) {
    await cards.scrollIntoViewIfNeeded();
    await radar.waitForTimeout(500);
    await shot(radar, "price-radar", "board-viewport.png");
  }
  let detailUrl = `${RADAR}/`;
  try {
    const products = await (await fetch(`${RADAR}/api/products`)).json();
    if (Array.isArray(products) && products[0]?.id) {
      detailUrl = `${RADAR}/product/${products[0].id}`;
    }
  } catch {
    const href = await radar.locator(".product-card").first().getAttribute("href");
    if (href) detailUrl = new URL(href, RADAR).toString();
  }
  await gotoReady(radar, detailUrl, 1600);
  await shot(radar, "price-radar", "detail-viewport.png");
  const chart = radar.locator(".chart-card").first();
  if (await chart.count()) {
    await chart.scrollIntoViewIfNeeded();
    await radar.waitForTimeout(400);
    await shot(radar, "price-radar", "chart-viewport.png");
  }
  await radar.close();
  }

  // ---------- Pulse ----------
  const pulse = await browser.newPage({ viewport: VIEWPORT, locale: "en-US" });
  await gotoReady(pulse, PULSE, 2200);
  const dismiss = pulse.getByRole("button", { name: /not now|close/i }).first();
  if (await dismiss.count()) {
    await dismiss.click().catch(() => {});
    await pulse.waitForTimeout(800);
  }
  await pulse.getByText("YOUR DEVICE", { exact: false }).first().waitFor({ timeout: 15000 }).catch(() => {});
  await pulse.waitForTimeout(600);
  await shot(pulse, "pulse", "hero-viewport.png");
  await pulse.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.22)));
  await pulse.waitForTimeout(700);
  await shot(pulse, "pulse", "trace-viewport.png");
  await pulse.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.4)));
  await pulse.waitForTimeout(700);
  await shot(pulse, "pulse", "diagnosis-viewport.png");
  await pulse.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.58)));
  await pulse.waitForTimeout(700);
  await shot(pulse, "pulse", "compare-viewport.png");
  await pulse.evaluate(() => window.scrollTo(0, Math.round(document.body.scrollHeight * 0.78)));
  await pulse.waitForTimeout(700);
  await shot(pulse, "pulse", "readout-viewport.png");
  const watchBtn = pulse.getByRole("button", { name: /watch it live|watch/i }).first();
  if (await watchBtn.count()) {
    await watchBtn.click().catch(() => {});
    await pulse.waitForTimeout(900);
  }
  const allow = pulse.getByRole("button", { name: /allow & watch|allow/i }).first();
  if (await allow.count()) {
    await allow.click().catch(() => {});
    await pulse.waitForTimeout(1200);
  }
  await shot(pulse, "pulse", "monitor-viewport.png");
  await pulse.close();

  // ---------- Middocs: two accounts, live sync ----------
  await waitForApi();
  const stamp = Date.now();
  const maya = {
    name: "Maya Chen",
    email: `maya.hud.${stamp}@example.com`,
    password: "HudShot12",
  };
  const alex = {
    name: "Alex Rivera",
    email: `alex.hud.${stamp}@example.com`,
    password: "HudShot12",
  };

  const ctxA = await browser.newContext({ viewport: VIEWPORT, locale: "en-US" });
  const ctxB = await browser.newContext({ viewport: VIEWPORT, locale: "en-US" });
  const pageA = await ctxA.newPage();
  const pageB = await ctxB.newPage();

  await gotoReady(pageA, `${MIDDOCS}/login`, 800);
  await shot(pageA, "middocs", "login-viewport.png");
  await gotoReady(pageA, `${MIDDOCS}/register`, 800);
  await shot(pageA, "middocs", "register-viewport.png");

  await fillByLabel(pageA, "Name", maya.name);
  await fillByLabel(pageA, "Email", maya.email);
  await fillByLabel(pageA, "Password", maya.password);
  await pageA.getByRole("button", { name: /create account/i }).click();
  await pageA.waitForURL(/\/($|\?)/, { timeout: 30000 });
  await pageA.waitForTimeout(1200);
  await shot(pageA, "middocs", "dashboard-empty-viewport.png");

  await pageA.getByRole("button", { name: /new document/i }).first().click();
  await pageA.waitForURL(/\/doc\//, { timeout: 30000 });
  await pageA.waitForSelector(".ql-editor", { timeout: 30000 });
  await pageA.waitForTimeout(1500);

  const titleInput = pageA.locator(".editor-title-input");
  await titleInput.fill("Launch brief");
  await pageA.waitForTimeout(400);

  const editorA = pageA.locator(".ql-editor");
  await editorA.click();
  await pageA.keyboard.type(
    "Launch brief — Q4.\nShip the collab editor with live cursors. Two people write in the same file; the CRDT does not fight itself.",
    { delay: 18 }
  );
  await pageA.waitForTimeout(900);
  await shot(pageA, "middocs", "editor-viewport.png");

  const docUrl = pageA.url();
  console.log("doc url", docUrl);

  await gotoReady(pageB, `${MIDDOCS}/register`, 800);
  await fillByLabel(pageB, "Name", alex.name);
  await fillByLabel(pageB, "Email", alex.email);
  await fillByLabel(pageB, "Password", alex.password);
  await pageB.getByRole("button", { name: /create account/i }).click();
  await pageB.waitForURL(/\/($|\?)/, { timeout: 30000 });
  await pageB.waitForTimeout(900);
  await gotoReady(pageB, docUrl, 1600);
  await pageB.waitForSelector(".ql-editor", { timeout: 30000 });
  await pageB.waitForTimeout(1800);

  const editorB = pageB.locator(".ql-editor");
  await editorB.click();
  await pageB.keyboard.press("End");
  await pageB.keyboard.press("Enter");
  await pageB.keyboard.press("Enter");
  await pageB.keyboard.type("Alex: presence is live. Two accounts, one Y.Doc — Maya’s paragraph is already here.", {
    delay: 22,
  });
  await pageA.waitForTimeout(400);
  await pageA.keyboard.type(" Maya sees Alex join.", { delay: 20 });
  await pageA.waitForTimeout(1200);
  await pageB.waitForTimeout(400);

  await shot(pageA, "middocs", "collab-maya-viewport.png");
  await shot(pageB, "middocs", "collab-alex-viewport.png");

  await pageA.locator(".icon-btn", { hasText: "💬" }).click().catch(async () => {
    await pageA.getByTitle("Comments").click();
  });
  await pageA.waitForTimeout(500);
  await shot(pageA, "middocs", "comments-viewport.png");

  await pageA.locator(".icon-btn").nth(0).click().catch(() => {});
  await gotoReady(pageA, MIDDOCS, 1000);
  await shot(pageA, "middocs", "dashboard-viewport.png");

  // Side-by-side composite of the two live sessions
  const split = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    locale: "en-US",
  });
  const mayaPng = path.join(ROOT, "middocs", "en", "collab-maya-viewport.png").replace(/\\/g, "/");
  const alexPng = path.join(ROOT, "middocs", "en", "collab-alex-viewport.png").replace(/\\/g, "/");
  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><style>
  html,body{margin:0;height:100%;background:#1a1430;color:#f4f1fb;font-family:Manrope,Segoe UI,sans-serif}
  .row{display:grid;grid-template-columns:1fr 1fr;height:100%}
  figure{margin:0;display:flex;flex-direction:column;height:100%;border-right:1px solid #362d52}
  figure:last-child{border-right:none}
  figcaption{padding:14px 18px;font-size:13px;letter-spacing:.12em;text-transform:uppercase;color:#b3aad0}
  img{width:100%;height:calc(100% - 46px);object-fit:cover;object-position:top;display:block}
</style></head>
<body>
  <div class="row">
    <figure>
      <figcaption>Maya Chen · account A</figcaption>
      <img src="file:///${mayaPng}">
    </figure>
    <figure>
      <figcaption>Alex Rivera · account B</figcaption>
      <img src="file:///${alexPng}">
    </figure>
  </div>
</body></html>`;
  const splitFile = path.join(ROOT, "middocs", "en", "_split.html");
  await writeFile(splitFile, html, "utf8");
  await split.goto("file:///" + splitFile.replace(/\\/g, "/"), { waitUntil: "load" });
  await split.waitForTimeout(600);
  await shot(split, "middocs", "collab-split-viewport.png");
  await split.close();

  await ctxA.close();
  await ctxB.close();
} finally {
  await browser.close();
}

console.log("done");
