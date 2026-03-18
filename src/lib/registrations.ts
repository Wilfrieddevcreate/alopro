import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { Registration } from "@/src/types/registration";

const DATA_DIR = join(process.cwd(), "data");
const DATA_PATH = join(DATA_DIR, "registrations.json");

async function ensureFile() {
  if (!existsSync(DATA_PATH)) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_PATH, "[]", "utf-8");
  }
}

export async function getRegistrations(): Promise<Registration[]> {
  await ensureFile();
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Registration[];
}

export async function getRegistrationsByTraining(trainingId: string): Promise<Registration[]> {
  const all = await getRegistrations();
  return all.filter((r) => r.trainingId === trainingId);
}

export async function createRegistration(trainingId: string, data: Record<string, string>): Promise<Registration> {
  const registrations = await getRegistrations();
  const reg: Registration = {
    id: crypto.randomUUID(),
    trainingId,
    data,
    createdAt: new Date().toISOString(),
  };
  registrations.push(reg);
  await writeFile(DATA_PATH, JSON.stringify(registrations, null, 2), "utf-8");
  return reg;
}

export async function deleteRegistration(id: string): Promise<boolean> {
  const registrations = await getRegistrations();
  const filtered = registrations.filter((r) => r.id !== id);
  if (filtered.length === registrations.length) return false;
  await writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
