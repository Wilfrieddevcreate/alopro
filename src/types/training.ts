import type { FormField } from "./registration";

export interface Training {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  descriptionFr: string;
  descriptionEn: string;
  image: string;
  startDate: string; // ISO date string — determines status
  formFields?: FormField[];
  status: "draft" | "published";
  createdAt: string;
  updatedAt: string;
}

export type TrainingStatus = "upcoming" | "ongoing" | "past";

export function getTrainingStatus(startDate: string): TrainingStatus {
  const start = new Date(startDate);
  const now = new Date();
  const endEstimate = new Date(start);
  endEstimate.setDate(endEstimate.getDate() + 30); // assume ~1 month duration

  if (now < start) return "upcoming";
  if (now <= endEstimate) return "ongoing";
  return "past";
}
