import { NextResponse } from "next/server";
import { getTrainings, createTraining } from "@/src/lib/trainings";
import { generateSlug } from "@/src/lib/blogs";

export async function GET() {
  const trainings = await getTrainings();
  const sorted = trainings.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}

export async function POST(request: Request) {
  const body = await request.json();
  const slug = generateSlug(body.titleFr || body.titleEn);
  const training = await createTraining({ ...body, slug });
  return NextResponse.json(training, { status: 201 });
}
