import { NextResponse } from "next/server";

import {
  castVote,
  isValidLevel,
  isVotableDish,
  readAllSpice,
  spiceAvailable,
} from "@/lib/spice";

const VOTER_RE = /^[A-Za-z0-9-]{8,64}$/;

const RATE_MAX = 30;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);

  if (hits.size > 5000) {
    for (const [entryKey, times] of hits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(entryKey);
    }
  }

  return recent.length > RATE_MAX;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function GET() {
  const aggregates = await readAllSpice();
  return NextResponse.json({ ok: true, aggregates });
}

export async function POST(request: Request) {
  if (!spiceAvailable()) {
    return NextResponse.json(
      { ok: false, error: "unavailable" },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 }
    );
  }

  if (isRateLimited(clientIp(request))) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }

  const data = body as { no?: unknown; level?: unknown; voterId?: unknown };

  if (!isVotableDish(data.no)) {
    return NextResponse.json(
      { ok: false, error: "invalid_dish" },
      { status: 400 }
    );
  }
  if (!isValidLevel(data.level)) {
    return NextResponse.json(
      { ok: false, error: "invalid_level" },
      { status: 400 }
    );
  }

  const voterId = typeof data.voterId === "string" ? data.voterId : "";
  if (!VOTER_RE.test(voterId)) {
    return NextResponse.json(
      { ok: false, error: "invalid_voter" },
      { status: 400 }
    );
  }

  try {
    const aggregate = await castVote(data.no, data.level, voterId);
    return NextResponse.json({ ok: true, no: data.no, aggregate });
  } catch {
    return NextResponse.json({ ok: false, error: "failed" }, { status: 500 });
  }
}
