import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import type { Training } from "@/src/types/training";

const DATA_DIR = join(process.cwd(), "data");
const DATA_PATH = join(DATA_DIR, "trainings.json");

async function ensureFile() {
  if (!existsSync(DATA_PATH)) {
    await mkdir(DATA_DIR, { recursive: true });
    await writeFile(DATA_PATH, "[]", "utf-8");
  }
}

export async function getTrainings(): Promise<Training[]> {
  await ensureFile();
  const raw = await readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Training[];
}

export async function getPublishedTrainings(): Promise<Training[]> {
  const trainings = await getTrainings();
  return trainings
    .filter((t) => t.status === "published")
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
}

export async function getTrainingById(id: string): Promise<Training | undefined> {
  const trainings = await getTrainings();
  return trainings.find((t) => t.id === id);
}

export async function createTraining(data: Omit<Training, "id" | "createdAt" | "updatedAt">): Promise<Training> {
  const trainings = await getTrainings();
  const now = new Date().toISOString();
  const training: Training = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  trainings.push(training);
  await writeFile(DATA_PATH, JSON.stringify(trainings, null, 2), "utf-8");
  return training;
}

export async function updateTraining(id: string, data: Partial<Omit<Training, "id" | "createdAt">>): Promise<Training | null> {
  const trainings = await getTrainings();
  const index = trainings.findIndex((t) => t.id === id);
  if (index === -1) return null;
  trainings[index] = { ...trainings[index], ...data, updatedAt: new Date().toISOString() };
  await writeFile(DATA_PATH, JSON.stringify(trainings, null, 2), "utf-8");
  return trainings[index];
}

export async function deleteTraining(id: string): Promise<boolean> {
  const trainings = await getTrainings();
  const filtered = trainings.filter((t) => t.id !== id);
  if (filtered.length === trainings.length) return false;
  await writeFile(DATA_PATH, JSON.stringify(filtered, null, 2), "utf-8");
  return true;
}
