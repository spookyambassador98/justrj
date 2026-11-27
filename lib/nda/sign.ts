/** Under-NDA case id → project id SalonTech already accepts on /api/visits. */
export const NDA_SALON_PROJECT: Record<string, string> = {
  orbital: "orbital-q",
  eye_master: "eye-master",
  asema: "trading",
  foamcore: "foamcore",
  lead_desk: "lead-desk",
  hire_desk: "hire-desk",
  drift: "drift",
};

const ENDPOINT = "https://salontech-mu.vercel.app/api/visits";
const STORE = "jr-nda-signed";

function readMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORE);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function ndaSigned(projectId: string) {
  return Boolean(readMap()[projectId]);
}

export function ndaSignedIds() {
  return Object.keys(readMap());
}

export async function submitNdaSignature(input: {
  projectId: string;
  projectTitle: string;
  name: string;
  company: string;
  path: string;
}) {
  const project = NDA_SALON_PROJECT[input.projectId];
  if (!project) throw new Error("unknown_project");

  const name = input.name.replace(/\s+/g, " ").trim().slice(0, 80);
  const company = input.company.replace(/\s+/g, " ").trim().slice(0, 80);
  if (name.length < 2 || company.length < 2) throw new Error("incomplete");

  const vid = (
    (crypto.randomUUID && crypto.randomUUID()) ||
    `v${Date.now().toString(36)}`
  ).replace(/[^a-zA-Z0-9_-]/g, "");

  const body = {
    vid,
    company,
    name,
    role: "NDA signature",
    project,
    events: [
      {
        type: "nda",
        path: input.path.slice(0, 320),
        detail: `signed · ${input.projectTitle} · ${name} · ${company}`.slice(0, 320),
        at: new Date().toISOString(),
      },
    ],
    referrer: document.referrer || null,
    landing: location.href.split("#")[0],
    href: location.href.split("#")[0],
    ua: navigator.userAgent,
    lang: navigator.language,
    tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
    screen: `${window.screen.width}x${window.screen.height}`,
    durationSec: 1,
  };

  // Logging the signature is best-effort. The SalonTech visits collector has
  // been failing (its storage is down), and the old code threw on any non-2xx,
  // which left recruiters stuck on "The signature did not go through" with no
  // way into the case. Now: try the collector (5 s cap), mirror the event to
  // this site's own /api/logger, and open the case either way.
  const payload = JSON.stringify(body);
  const remote = (async () => {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 5000);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: payload,
        mode: "cors",
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      return res.ok;
    } catch {
      return false;
    }
  })();
  try {
    const mirror = JSON.stringify({
      vid,
      events: body.events,
      referrer: body.referrer,
      landing: body.landing,
      href: body.href,
      ua: body.ua,
      lang: body.lang,
      tz: body.tz,
      screen: body.screen,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/logger", new Blob([mirror], { type: "application/json" }));
    }
  } catch {
    /* ignore */
  }
  await remote;

  const map = readMap();
  map[input.projectId] = name;
  try {
    localStorage.setItem(STORE, JSON.stringify(map));
  } catch {
    /* private mode — the case still opens for this page view */
  }
}
