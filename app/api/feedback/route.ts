import { NextResponse } from "next/server";

/**
 * Receives feedback from the dialog. It works out of the box by logging to the
 * server, and — if you set the FEEDBACK_WEBHOOK_URL env var — it also forwards
 * each message to a Discord incoming webhook.
 *
 * Spam protection: a honeypot field, a minimum length, and a best-effort
 * per-IP rate limit.
 */

const MIN_LENGTH = 3;
const MAX_LENGTH = 2000;
const EMAIL_MAX_LENGTH = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort in-memory rate limit. Note: serverless instances are ephemeral
// and not shared, so this throttles bursts per instance rather than globally —
// enough to blunt basic abuse. For hard guarantees use a shared store (e.g.
// Upstash/Vercel KV).
const RATE_MAX = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  // Occasionally prune stale IPs so the map can't grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
    }
  }

  return recent.length > RATE_MAX;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const data = body as {
    message?: unknown;
    email?: unknown;
    company?: unknown;
    path?: unknown;
  };

  // Honeypot: if the hidden field is filled, silently accept and drop it so the
  // bot believes it succeeded.
  if (typeof data.company === "string" && data.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  const message = typeof data.message === "string" ? data.message.trim() : "";
  if (message.length < MIN_LENGTH) {
    return NextResponse.json({ ok: false, error: "too_short" }, { status: 400 });
  }
  if (message.length > MAX_LENGTH) {
    return NextResponse.json({ ok: false, error: "too_long" }, { status: 400 });
  }

  // Optional email — only kept if the visitor chose to give it (to get a reply).
  const email = typeof data.email === "string" ? data.email.trim() : "";
  if (email !== "" && (email.length > EMAIL_MAX_LENGTH || !EMAIL_RE.test(email))) {
    return NextResponse.json(
      { ok: false, error: "invalid_email" },
      { status: 400 }
    );
  }

  const entry = {
    message,
    email: email || undefined,
    path: typeof data.path === "string" ? data.path : undefined,
    at: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? undefined,
  };

  // Always keep a server-side record in the logs.
  console.log("[feedback]", entry);

  // Optional: forward to a Discord webhook if one is configured.
  const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL;
  if (webhookUrl) {
    const text =
      `📝 Feedback\n${message}` +
      (entry.email ? `\n✉️ Svara till: ${entry.email}` : "") +
      (entry.path ? `\n(sida: ${entry.path})` : "");
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
    } catch (error) {
      // Don't fail the user's request if the webhook is momentarily down.
      console.error("[feedback] webhook failed", error);
    }
  }

  return NextResponse.json({ ok: true });
}
