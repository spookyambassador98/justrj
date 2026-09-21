import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { copyFile } from "node:fs/promises";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = path.join(root, "scripts", "resume.html");
const outPublic = path.join(root, "public", "resume.pdf");
const outDesktop = path.join("C:", "Users", "bakuw", "Desktop", "RaufPashabayli-Resume.pdf");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto(pathToFileURL(html).href, { waitUntil: "load" });
await page.pdf({
  path: outPublic,
  format: "letter",
  printBackground: true,
  margin: { top: "0.48in", bottom: "0.48in", left: "0.52in", right: "0.52in" },
});
await browser.close();
await copyFile(outPublic, outDesktop);
console.log("wrote", outPublic);
console.log("wrote", outDesktop);
