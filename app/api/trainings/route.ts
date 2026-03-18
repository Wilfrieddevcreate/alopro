import { NextResponse } from "next/server";
import { getPublishedTrainings } from "@/src/lib/trainings";

export const dynamic = "force-dynamic";

export async function GET() {
  const trainings = await getPublishedTrainings();
  return NextResponse.json(trainings);
}
