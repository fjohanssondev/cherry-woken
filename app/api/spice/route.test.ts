import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@upstash/redis", () => {
  class Redis {
    store = new Map<string, Map<string, unknown>>();

    async hset(key: string, obj: Record<string, unknown>) {
      const hash = this.store.get(key) ?? new Map<string, unknown>();
      let added = 0;
      for (const [field, value] of Object.entries(obj)) {
        if (!hash.has(field)) added++;
        hash.set(field, value);
      }
      this.store.set(key, hash);
      return added;
    }

    async hvals(key: string) {
      return [...(this.store.get(key)?.values() ?? [])];
    }

    async hdel(key: string, field: string) {
      this.store.get(key)?.delete(field);
      return 1;
    }

    pipeline() {
      const ops: Array<() => Promise<unknown>> = [];
      const api = {
        hvals: (key: string) => {
          ops.push(() => this.hvals(key));
          return api;
        },
        exec: () => Promise.all(ops.map((op) => op())),
      };
      return api;
    }
  }
  return { Redis };
});

vi.mock("next/server", async (importOriginal) => {
  const actual = await importOriginal<typeof import("next/server")>();
  return { ...actual, after: (fn: () => void) => void fn };
});

beforeEach(() => {
  vi.resetModules();
  process.env.UPSTASH_STORAGE_KV_REST_API_URL = "https://example.upstash.io";
  process.env.UPSTASH_STORAGE_KV_REST_API_TOKEN = "test-token";
});

describe("spice vote logic", () => {
  it("keys votes by dish id and aggregates them", async () => {
    const spice = await import("@/lib/spice");
    const first = await spice.castVote("d16", 2, "voter-aaaaaaaa");
    expect(first).toEqual({ aggregate: { count: 1, avg: 2 }, isNew: true });

    const second = await spice.castVote("d16", 3, "voter-bbbbbbbb");
    expect(second.aggregate).toEqual({ count: 2, avg: 2.5 });

    const all = await spice.readAllSpice();
    expect(all).toEqual({ d16: { count: 2, avg: 2.5 } });
  });

  it("removes a voter's vote", async () => {
    const spice = await import("@/lib/spice");
    await spice.castVote("d16", 2, "voter-aaaaaaaa");
    const aggregate = await spice.removeVote("d16", "voter-aaaaaaaa");
    expect(aggregate).toEqual({ count: 0, avg: 0 });
  });
});

async function postVote(body: Record<string, unknown>) {
  const { POST } = await import("@/app/api/spice/route");
  const request = new Request("http://localhost/api/spice", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": "5.5.5.5" },
    body: JSON.stringify(body),
  });
  const response = await POST(request);
  return { status: response.status, json: await response.json() };
}

describe("spice POST route", () => {
  it("accepts a valid vote and returns the id", async () => {
    const { status, json } = await postVote({
      id: "d16",
      level: 2,
      voterId: "abcdefgh",
    });
    expect(status).toBe(200);
    expect(json.id).toBe("d16");
    expect(json.aggregate).toEqual({ count: 1, avg: 2 });
  });

  it("rejects an unknown dish", async () => {
    const { status, json } = await postVote({
      id: "d999",
      level: 2,
      voterId: "abcdefgh",
    });
    expect(status).toBe(400);
    expect(json.error).toBe("invalid_dish");
  });

  it("rejects an unnumbered extra", async () => {
    const { status, json } = await postVote({
      id: "d60",
      level: 2,
      voterId: "abcdefgh",
    });
    expect(status).toBe(400);
    expect(json.error).toBe("invalid_dish");
  });

  it("rejects an out-of-range level", async () => {
    const { status, json } = await postVote({
      id: "d16",
      level: 5,
      voterId: "abcdefgh",
    });
    expect(status).toBe(400);
    expect(json.error).toBe("invalid_level");
  });

  it("rejects a malformed voter id", async () => {
    const { status, json } = await postVote({
      id: "d16",
      level: 2,
      voterId: "short",
    });
    expect(status).toBe(400);
    expect(json.error).toBe("invalid_voter");
  });
});
