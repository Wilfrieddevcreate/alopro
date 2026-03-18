import { NextRequest, NextResponse } from "next/server";
import { getRegistrations, getRegistrationsByTraining } from "@/src/lib/registrations";

export async function GET(req: NextRequest) {
  const trainingId = req.nextUrl.searchParams.get("trainingId");
  const registrations = trainingId
    ? await getRegistrationsByTraining(trainingId)
    : await getRegistrations();
  const sorted = registrations.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return NextResponse.json(sorted);
}
