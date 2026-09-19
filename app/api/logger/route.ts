import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../../lib/cors";
import { verifyAdminPin } from "../../../lib/leads/store";
import { ingestLoggerVisit, listLoggerVisitors } from "../../../lib/logger/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(req: NextRequest, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req) });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function GET(req: NextRequest) {
  if (!verifyAdminPin(req.headers.get("x-admin-pin") || "")) {
    return json(req, { error: "Unauthorized" }, 401);
  }
  const visitors = await listLoggerVisitors();
  return json(req, { ok: true, source: "justrj", visitors, count: visitors.length });
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as Record<string, unknown>;
    const fwd = req.headers.get("x-forwarded-for") || "";
    const ip = fwd.split(",")[0]?.trim() || req.headers.get("x-real-ip");
    const visitor = await ingestLoggerVisit(
      {
        vid: typeof payload.vid === "string" ? payload.vid : undefined,
        events: Array.isArray(payload.events)
          ? (payload.events as { type?: string; path?: string; detail?: string; at?: string }[])
          : undefined,
        referrer: typeof payload.referrer === "string" ? payload.referrer : null,
        landing: typeof payload.landing === "string" ? payload.landing : undefined,
        href: typeof payload.href === "string" ? payload.href : undefined,
        ua: typeof payload.ua === "string" ? payload.ua : undefined,
        lang: typeof payload.lang === "string" ? payload.lang : undefined,
        tz: typeof payload.tz === "string" ? payload.tz : undefined,
        screen: typeof payload.screen === "string" ? payload.screen : undefined,
        utm:
          payload.utm && typeof payload.utm === "object"
            ? (payload.utm as Record<string, string>)
            : undefined,
      },
      {
        ip: ip || null,
        country: req.headers.get("x-vercel-ip-country"),
        city: req.headers.get("x-vercel-ip-city"),
      },
    );
    return json(req, { ok: true, id: visitor.id });
  } catch {
    return json(req, { ok: false }, 400);
  }
}
