import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export interface Visit {
  id: string;
  page: string;
  ip: string;
  userAgent: string;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface VisitorStats {
  today: number;
  yesterday: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  uniqueToday: number;
  uniqueTotal: number;
  topPages: { page: string; count: number }[];
}

const DATA_DIR = join(process.cwd(), "data");
const DATA_PATH = join(DATA_DIR, "visitors.json");

async function ensureFile() {
  if (!existsSync(DATA_PATH)) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_PATH, "[]", "utf-8");
  }
}

async function getVisits(): Promise<Visit[]> {
  await ensureFile();
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Visit[];
}

export async function recordVisit(page: string, ip: string, userAgent: string): Promise<void> {
  const visits = await getVisits();
  const now = new Date();
  const visit: Visit = {
    id: crypto.randomUUID(),
    page,
    ip,
    userAgent,
    date: now.toISOString().split("T")[0],
    createdAt: now.toISOString(),
  };
  visits.push(visit);

  // Keep only last 90 days of data to prevent file bloat
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 90);
  const cutoffStr = cutoff.toISOString().split("T")[0];
  const filtered = visits.filter((v) => v.date >= cutoffStr);

  await writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
}

export async function getVisitorStats(): Promise<VisitorStats> {
  const visits = await getVisits();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

  const todayVisits = visits.filter((v) => v.date === todayStr);
  const yesterdayVisits = visits.filter((v) => v.date === yesterdayStr);
  const weekVisits = visits.filter((v) => v.date >= weekAgoStr);
  const monthVisits = visits.filter((v) => v.date >= monthStart);

  const uniqueToday = new Set(todayVisits.map((v) => v.ip)).size;
  const uniqueTotal = new Set(visits.map((v) => v.ip)).size;

  // Top pages
  const pageCounts: Record<string, number> = {};
  for (const v of visits) {
    pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
  }
  const topPages = Object.entries(pageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([page, count]) => ({ page, count }));

  return {
    today: todayVisits.length,
    yesterday: yesterdayVisits.length,
    thisWeek: weekVisits.length,
    thisMonth: monthVisits.length,
    total: visits.length,
    uniqueToday,
    uniqueTotal,
    topPages,
  };
}
