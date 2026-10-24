import { NextResponse, type NextRequest } from "next/server";
import { validateContact, type ContactResponse } from "@/lib/contact";
import { storeMessage } from "@/lib/server/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 12_000;
const MIN_FILL_MS = 1500; // faster than any person can fill the form

// Best-effort per-instance limiter; the database trigger is the hard limit.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  recent.set(ip, hits);
  if (recent.size > 5000) {
    for (const [key, times] of recent) {
      if (times.every((t) => now - t >= WINDOW_MS)) recent.delete(key);
    }
  }
  return hits.length > MAX_PER_WINDOW;
}

function reply(body: ContactResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) {
    return reply({ ok: false, error: "Requests must come from this site." }, 403);
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ ok: false, error: "Unsupported request format." }, 415);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return reply({ ok: false, error: "That message is too long." }, 413);
  }

  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "Invalid request." }, 400);
  }

  // Bots that fill the hidden field or submit instantly get a quiet success.
  const elapsed = typeof body.elapsed === "number" ? body.elapsed : 0;
  if ((typeof body.website === "string" && body.website !== "") || elapsed < MIN_FILL_MS) {
    return reply({ ok: true });
  }

  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return reply({ ok: false, error: "You've sent a few messages already. Please try again later." }, 429);
  }

  const { data, errors } = validateContact(body);
  if (!data) {
    return reply({ ok: false, error: "Please check the highlighted fields.", fieldErrors: errors }, 400);
  }

  const stored = await storeMessage(data);
  if (stored === "rate_limited") {
    return reply({ ok: false, error: "You've sent a few messages already. Please try again later." }, 429);
  }
  if (stored !== "stored") {
    return reply({ ok: false, error: "I couldn't save your message just now. Please try again shortly." }, 503);
  }

  return reply({ ok: true });
}
