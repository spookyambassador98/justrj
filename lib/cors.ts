const DEFAULT_ORIGINS = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://salontech-ops.vercel.app",
  "https://santien-portal.vercel.app",
  "https://santien.leads-club.vercel.app",
];

export function portalOrigins(): string[] {
  const fromEnv = (process.env.ADMIN_PORTAL_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return [...DEFAULT_ORIGINS, ...fromEnv];
}

export function corsHeaders(req: Request): HeadersInit {
  const origin = req.headers.get("origin") || "";
  const allowed = portalOrigins();
  const ok = allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, x-admin-pin",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
