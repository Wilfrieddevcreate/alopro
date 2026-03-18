import { NextRequest, NextResponse } from "next/server";
import { recordVisit } from "@/src/lib/visitors";

export async function POST(req: NextRequest) {
  try {
    const { page } = await req.json();
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    await recordVisit(page || "/", ip, userAgent);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
