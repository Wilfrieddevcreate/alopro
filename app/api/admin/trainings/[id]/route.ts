import { NextResponse } from "next/server";
import { getTrainingById, updateTraining, deleteTraining } from "@/src/lib/trainings";
import { generateSlug } from "@/src/lib/blogs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const training = await getTrainingById(id);
  if (!training) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(training);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  if (body.titleFr || body.titleEn) {
    body.slug = generateSlug(body.titleFr || body.titleEn);
  }
  const training = await updateTraining(id, body);
  if (!training) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(training);
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = await deleteTraining(id);
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
