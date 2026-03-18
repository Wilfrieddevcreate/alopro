import { NextResponse } from "next/server";
import { getVisitorStats } from "@/src/lib/visitors";

export async function GET() {
  try {
    const stats = await getVisitorStats();
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json(
      { today: 0, yesterday: 0, thisWeek: 0, thisMonth: 0, total: 0, uniqueToday: 0, uniqueTotal: 0, topPages: [] },
      { status: 500 }
    );
  }
}
