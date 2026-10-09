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
        detail: `signed · ${input.projectTitle}`.slice(0, 320),
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

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify(body),
    mode: "cors",
  });
  if (!res.ok) throw new Error("sign_failed");

  const map = readMap();
  map[input.projectId] = name;
  localStorage.setItem(STORE, JSON.stringify(map));
}
