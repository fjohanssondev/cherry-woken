import { beforeEach, describe, expect, it, vi } from "vitest";

type FeedbackBody = {
  message?: unknown;
  email?: unknown;
  company?: unknown;
  path?: unknown;
};

async function post(body: FeedbackBody | string, ip = "1.2.3.4") {
  const { POST } = await import("@/app/api/feedback/route");
  const request = new Request("http://localhost/api/feedback", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
  const response = await POST(request);
  return { status: response.status, json: await response.json() };
}

beforeEach(() => {
  vi.resetModules();
  delete process.env.FEEDBACK_WEBHOOK_URL;
});

describe("feedback POST", () => {
  it("accepts a valid message", async () => {
    const { status, json } = await post({ message: "Bra sida, tack!" });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("rejects malformed json", async () => {
    const { status, json } = await post("not json");
    expect(status).toBe(400);
    expect(json.error).toBe("invalid_json");
  });

  it("rejects a too-short message", async () => {
    const { status, json } = await post({ message: "hi" });
    expect(status).toBe(400);
    expect(json.error).toBe("too_short");
  });

  it("rejects an invalid email", async () => {
    const { status, json } = await post({
      message: "Hör gärna av er",
      email: "not-an-email",
    });
    expect(status).toBe(400);
    expect(json.error).toBe("invalid_email");
  });

  it("silently drops honeypot submissions", async () => {
    const { status, json } = await post({
      message: "spam spam spam",
      company: "definitely a bot",
    });
    expect(status).toBe(200);
    expect(json.ok).toBe(true);
  });

  it("rate limits bursts from one ip", async () => {
    const ip = "9.9.9.9";
    let last = { status: 200, json: { ok: true } as Record<string, unknown> };
    for (let i = 0; i < 6; i++) {
      last = await post({ message: `meddelande ${i}` }, ip);
    }
    expect(last.status).toBe(429);
    expect(last.json.error).toBe("rate_limited");
  });
});
