import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get, put } from "@vercel/blob";

export type LoggerEvent = {
  id: string;
  at: string;
  type: string;
  path: string;
  detail?: string;
};

export type LoggerVisitor = {
  id: string;
  firstAt: string;
  lastAt: string;
  hits: number;
  channel: string;
  referrer: string | null;
  landing: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  ua: string | null;
  lang: string | null;
  tz: string | null;
  screen: string | null;
  utm: Record<string, string>;
  events: LoggerEvent[];
};

const LOCAL_PATH = path.join(process.cwd(), "data", "rj-logger.json");
const BLOB_PATH = "rj-logger.json";
const MAX_VISITORS = 500;
const MAX_EVENTS = 160;

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function detectChannel(
  referrer: string | null,
  utm: Record<string, string>,
  ua?: string | null,
) {
  const src = (utm.utm_source || utm.source || utm.utm_medium || "").toLowerCase();
  const ref = (referrer || "").toLowerCase();
  const agent = (ua || "").toLowerCase();
  const hay = `${src} ${ref}`;

  if (/linkedinapp/.test(agent) || /linkedin|lnkd\.in/.test(hay)) return "LinkedIn";
  if (/instagram/.test(agent) || /instagram|l\.instagram/.test(hay)) return "Instagram";
  if (/fban|fbav|fb_iab/.test(agent) || /facebook|fb\.com|l\.facebook/.test(hay)) return "Facebook";
  if (/twitter for|twitterandroid/.test(agent) || /twitter|x\.com|t\.co/.test(hay)) return "X / Twitter";
  if (/wellfound|angel\.co|angellist/.test(hay)) return "Wellfound";
  if (/indeed/.test(hay)) return "Indeed";
  if (/greenhouse|job-boards\.greenhouse/.test(hay)) return "Greenhouse";
  if (/lever\.co/.test(hay)) return "Lever";
  if (/ashbyhq/.test(hay)) return "Ashby";
  if (/workatastartup|ycombinator|news\.ycombinator/.test(hay)) return "Y Combinator";
  if (/otta\.com/.test(hay)) return "Otta";
  if (/glassdoor/.test(hay)) return "Glassdoor";
  if (/github/.test(hay)) return "GitHub";
  if (/google/.test(hay)) return "Google";
  if (/bing/.test(hay)) return "Bing";
  if (/duckduckgo/.test(hay)) return "DuckDuckGo";
  if (/yandex/.test(hay)) return "Yandex";
  if (/t\.me|telegram/.test(hay)) return "Telegram";
  if (/whatsapp|wa\.me/.test(hay)) return "WhatsApp";
  if (/youtube/.test(hay)) return "YouTube";
  if (/reddit/.test(hay)) return "Reddit";
  if (/mail\.|outlook|gmail|yahoo/.test(hay)) return "Email";
  if (src) return src;
  if (referrer) {
    try {
      return new URL(referrer).hostname.replace(/^www\./, "");
    } catch {
      return "Referral";
    }
  }
  return "Direct";
}

async function readAll(): Promise<LoggerVisitor[]> {
  try {
    if (useBlob()) {
      const result = await get(BLOB_PATH, { access: "private", useCache: false });
      if (!result?.stream) return [];
      const text = await new Response(result.stream).text();
      if (!text.trim()) return [];
      const parsed = JSON.parse(text) as LoggerVisitor[];
      return Array.isArray(parsed) ? parsed : [];
    }
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    const parsed = JSON.parse(raw) as LoggerVisitor[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeAll(list: LoggerVisitor[]) {
  const body = JSON.stringify(list);
  if (useBlob()) {
    await put(BLOB_PATH, body, {
      access: "private",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    return;
  }
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, body, "utf8");
}

export async function listLoggerVisitors() {
  const list = await readAll();
  return list.sort((a, b) => (a.lastAt < b.lastAt ? 1 : -1));
}

export type IngestPayload = {
  vid?: string;
  events?: { type?: string; path?: string; detail?: string; at?: string }[];
  referrer?: string | null;
  landing?: string;
  href?: string;
  ua?: string | null;
  lang?: string | null;
  tz?: string | null;
  screen?: string | null;
  utm?: Record<string, string>;
};

export async function ingestLoggerVisit(
  payload: IngestPayload,
  meta: { ip: string | null; country: string | null; city: string | null },
) {
  const now = new Date().toISOString();
  const vid =
    (payload.vid || "").replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 40) ||
    randomUUID();
  const utm = payload.utm && typeof payload.utm === "object" ? payload.utm : {};
  const referrer = payload.referrer || null;
  const channel = detectChannel(referrer, utm, payload.ua);
  const incoming = Array.isArray(payload.events) ? payload.events : [];
  const events: LoggerEvent[] = incoming.slice(0, 40).map((e) => ({
    id: randomUUID(),
    at: e.at || now,
    type: String(e.type || "page").slice(0, 40),
    path: String(e.path || payload.href || "/").slice(0, 320),
    detail: e.detail ? String(e.detail).slice(0, 320) : undefined,
  }));
  if (!events.length) {
    events.push({
      id: randomUUID(),
      at: now,
      type: "page",
      path: String(payload.href || payload.landing || "/").slice(0, 320),
    });
  }

  const list = await readAll();
  let row = list.find((v) => v.id === vid);
  if (!row) {
    row = {
      id: vid,
      firstAt: now,
      lastAt: now,
      hits: 0,
      channel,
      referrer,
      landing: String(payload.landing || payload.href || "/").slice(0, 320),
      ip: meta.ip,
      country: meta.country,
      city: meta.city,
      ua: payload.ua || null,
      lang: payload.lang || null,
      tz: payload.tz || null,
      screen: payload.screen || null,
      utm,
      events: [],
    };
    list.unshift(row);
  }
  row.lastAt = now;
  row.hits += 1;
  if (channel !== "Direct") row.channel = channel;
  if (referrer) row.referrer = referrer;
  if (meta.ip) row.ip = meta.ip;
  if (meta.country) row.country = meta.country;
  if (meta.city) row.city = meta.city;
  if (payload.ua) row.ua = payload.ua;
  if (payload.lang) row.lang = payload.lang;
  if (payload.tz) row.tz = payload.tz;
  if (payload.screen) row.screen = payload.screen;
  if (Object.keys(utm).length) row.utm = { ...row.utm, ...utm };
  row.events = [...events, ...row.events].slice(0, MAX_EVENTS);
  const trimmed = list.slice(0, MAX_VISITORS);
  await writeAll(trimmed);
  return row;
}
