import { Redis } from "@upstash/redis";
import { menu, type Dish } from "@/data/menu";

export type SpiceAggregate = { count: number; avg: number };
export type SpiceAggregates = Record<string, SpiceAggregate>;

export const SPICE_MIN = 1;
export const SPICE_MAX = 3;

const votableDishes = (() => {
  const map = new Map<string, Dish>();
  for (const section of menu) {
    for (const dish of section.dishes) {
      if (dish.no != null) map.set(dish.id, dish);
    }
  }
  return map;
})();

export function isVotableDish(id: unknown): id is string {
  return typeof id === "string" && votableDishes.has(id);
}

export function dishName(id: string): string | undefined {
  return votableDishes.get(id)?.name;
}

export function dishNumber(id: string): number | undefined {
  return votableDishes.get(id)?.no;
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

function key(id: string): string {
  return `spice:${id}`;
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
  const ids = [...votableDishes.keys()];
  const pipeline = redis.pipeline();
  for (const id of ids) pipeline.hvals(key(id));
  const results = (await pipeline.exec()) as unknown[];
  const out: SpiceAggregates = {};
  ids.forEach((id, index) => {
    const agg = aggregate(toNumbers(results[index]));
    if (agg.count > 0) out[id] = agg;
  });
  return out;
}

export type VoteResult = { aggregate: SpiceAggregate; isNew: boolean };

export async function castVote(
  id: string,
  level: number,
  voterId: string
): Promise<VoteResult> {
  const redis = getRedis();
  if (!redis) throw new Error("spice_unavailable");
  const added = await redis.hset(key(id), { [voterId]: level });
  const agg = aggregate(toNumbers(await redis.hvals(key(id))));
  return { aggregate: agg, isNew: added === 1 };
}

export async function removeVote(
  id: string,
  voterId: string
): Promise<SpiceAggregate> {
  const redis = getRedis();
  if (!redis) throw new Error("spice_unavailable");
  await redis.hdel(key(id), voterId);
  return aggregate(toNumbers(await redis.hvals(key(id))));
}
