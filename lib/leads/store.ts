import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { get, put } from "@vercel/blob";
import { getServiceSupabase, hasSupabase } from "../supabase";
import type { Lead, LeadInput, LeadStatus } from "./types";

const LOCAL_PATH = path.join(process.cwd(), "data", "leads.json");
const BLOB_PATH = "leads.json";

export type LeadsMode = "supabase" | "blob" | "local";

export function leadsMode(): LeadsMode {
  if (hasSupabase()) return "supabase";
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  return "local";
}

async function readLocal(): Promise<Lead[]> {
  try {
    const raw = await fs.readFile(LOCAL_PATH, "utf8");
    return JSON.parse(raw) as Lead[];
  } catch {
    return [];
  }
}

async function writeLocal(leads: Lead[]) {
  await fs.mkdir(path.dirname(LOCAL_PATH), { recursive: true });
  await fs.writeFile(LOCAL_PATH, JSON.stringify(leads, null, 2), "utf8");
}

async function readBlob(): Promise<Lead[]> {
  const result = await get(BLOB_PATH, { access: "private", useCache: false });
  if (!result?.stream) return [];
  const text = await new Response(result.stream).text();
  if (!text.trim()) return [];
  return JSON.parse(text) as Lead[];
}

async function writeBlob(leads: Lead[]) {
  await put(BLOB_PATH, JSON.stringify(leads, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

async function readAll(): Promise<Lead[]> {
  const mode = leadsMode();
  if (mode === "supabase") {
    const sb = getServiceSupabase()!;
    const { data, error } = await sb
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as Lead[];
  }
  if (mode === "blob") return readBlob();
  return readLocal();
}

async function writeAll(leads: Lead[]) {
  const mode = leadsMode();
  if (mode === "blob") {
    await writeBlob(leads);
    return;
  }
  await writeLocal(leads);
}

export async function listLeads(): Promise<Lead[]> {
  const leads = await readAll();
  return leads.sort((a, b) => (a.created_at < b.created_at ? 1 : -1));
}

export async function createLead(input: LeadInput): Promise<Lead> {
  const lead: Lead = {
    id: randomUUID(),
    created_at: new Date().toISOString(),
    status: "new",
    ...input,
  };

  if (leadsMode() === "supabase") {
    const sb = getServiceSupabase()!;
    const { data, error } = await sb.from("leads").insert(lead).select().single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  const local = await readAll();
  local.unshift(lead);
  await writeAll(local);
  return lead;
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  if (leadsMode() === "supabase") {
    const sb = getServiceSupabase()!;
    const { data, error } = await sb
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data as Lead;
  }

  const local = await readAll();
  const idx = local.findIndex((l) => l.id === id);
  if (idx < 0) throw new Error("Lead not found");
  local[idx] = { ...local[idx], status };
  await writeAll(local);
  return local[idx];
}

export function verifyAdminPin(pin: string) {
  const expected = process.env.ADMIN_PIN || "7777";
  return pin === expected;
}
