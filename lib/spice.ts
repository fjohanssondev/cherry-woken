import { Redis } from "@upstash/redis";
import { menu } from "@/data/menu";

export type SpiceAggregate = { count: number; avg: number };
export type SpiceAggregates = Record<number, SpiceAggregate>;

export const SPICE_MIN = 1;
export const SPICE_MAX = 3;

const dishNamesByNo = (() => {
  const map = new Map<number, string>();
  for (const section of menu) {
    for (const dish of section.dishes) {
      if (dish.no != null) map.set(dish.no, dish.name);
    }
  }
  return map;
})();

export function isVotableDish(no: unknown): no is number {
  return typeof no === "number" && dishNamesByNo.has(no);
}

export function dishName(no: number): string | undefined {
  return dishNamesByNo.get(no);
}

export function isValidLevel(level: unknown): level is number {
  return (
    typeof level === "number" &&
    Number.isInteger(level) &&
    level >= SPICE_MIN &&
    level <= SPICE_MAX
  );
}

let client: Redis | null | undefined;

function getRedis(): Redis | null {
  if (client !== undefined) return client;
  const url = process.env.UPSTASH_STORAGE_KV_REST_API_URL;
  const token = process.env.UPSTASH_STORAGE_KV_REST_API_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  return client;
}

export function spiceAvailable(): boolean {
  return getRedis() !== null;
}

function key(no: number): string {
  return `spice:${no}`;
}

function aggregate(values: number[]): SpiceAggregate {
  const count = values.length;
  if (count === 0) return { count: 0, avg: 0 };
  const sum = values.reduce((total, value) => total + value, 0);
  return { count, avg: sum / count };
}

function toNumbers(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

export async function readAllSpice(): Promise<SpiceAggregates> {
  const redis = getRedis();
  if (!redis) return {};
  const numbers = [...dishNamesByNo.keys()];
  const pipeline = redis.pipeline();
  for (const no of numbers) pipeline.hvals(key(no));
  const results = (await pipeline.exec()) as unknown[];
  const out: SpiceAggregates = {};
  numbers.forEach((no, index) => {
    const agg = aggregate(toNumbers(results[index]));
    if (agg.count > 0) out[no] = agg;
  });
  return out;
}

export type VoteResult = { aggregate: SpiceAggregate; isNew: boolean };

export async function castVote(
  no: number,
  level: number,
  voterId: string
): Promise<VoteResult> {
  const redis = getRedis();
  if (!redis) throw new Error("spice_unavailable");
  const added = await redis.hset(key(no), { [voterId]: level });
  const agg = aggregate(toNumbers(await redis.hvals(key(no))));
  return { aggregate: agg, isNew: added === 1 };
}

export async function removeVote(
  no: number,
  voterId: string
): Promise<SpiceAggregate> {
  const redis = getRedis();
  if (!redis) throw new Error("spice_unavailable");
  await redis.hdel(key(no), voterId);
  return aggregate(toNumbers(await redis.hvals(key(no))));
}
