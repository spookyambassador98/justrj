import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "../../../lib/cors";
import { createLead, leadsMode, listLeads, updateLeadStatus, verifyAdminPin } from "../../../lib/leads/store";
import type { LeadInput, LeadStatus } from "../../../lib/leads/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminOk(req: NextRequest) {
  const pin = req.headers.get("x-admin-pin") || "";
  return verifyAdminPin(pin);
}

function json(req: NextRequest, body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders(req) });
}

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export async function GET(req: NextRequest) {
  try {
    const code = (req.nextUrl.searchParams.get("code") || "").trim();

    // Partner-scoped read: ?code=XXXX — returns only that specialist's leads (no admin pin).
    if (code) {
      const all = await listLeads();
      const leads = all.filter(
        (l) => l.specialist_code.trim().toUpperCase() === code.toUpperCase()
      );
      return json(req, {
        leads,
        mode: leadsMode(),
        scoped: true,
      });
    }

    if (!adminOk(req)) {
      return json(req, { error: "Unauthorized" }, 401);
    }
    const leads = await listLeads();
    return json(req, {
      leads,
      mode: leadsMode(),
    });
  } catch (err) {
    return json(
      req,
      { error: err instanceof Error ? err.message : "Failed to load" },
      500
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<LeadInput>;
    if (!body.name?.trim() || !body.contact_method?.trim()) {
      return json(req, { error: "Name and contact are required" }, 400);
    }

    const input: LeadInput = {
      name: String(body.name || "").trim(),
      company: String(body.company || "").trim(),
      contact_method: String(body.contact_method || "").trim(),
      project_type: String(body.project_type || "").trim(),
      business_goal: String(body.business_goal || "").trim(),
      key_features: String(body.key_features || "").trim(),
      references: String(body.references || "").trim(),
      deadline: String(body.deadline || "").trim(),
      budget: String(body.budget || "").trim(),
      specialist_code: String(body.specialist_code || "").trim(),
      lang: body.lang === "en" ? "en" : body.lang === "uk" ? "uk" : "ru",
    };

    const lead = await createLead(input);
    return json(req, { lead }, 201);
  } catch (err) {
    return json(
      req,
      { error: err instanceof Error ? err.message : "Failed to create" },
      500
    );
  }
}

export async function PATCH(req: NextRequest) {
  if (!adminOk(req)) {
    return json(req, { error: "Unauthorized" }, 401);
  }
  try {
    const body = (await req.json()) as { id?: string; status?: LeadStatus };
    if (!body.id || !body.status) {
      return json(req, { error: "id and status required" }, 400);
    }
    const lead = await updateLeadStatus(body.id, body.status);
    return json(req, { lead });
  } catch (err) {
    return json(
      req,
      { error: err instanceof Error ? err.message : "Failed to update" },
      500
    );
  }
}
