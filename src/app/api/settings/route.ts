import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const rows = await prisma!.setting.findMany();
    const settings: Record<string, string> = {};
    rows.forEach((r) => { settings[r.key] = r.value; });
    return NextResponse.json(settings);
  } catch (e) {
    console.error("[settings] GET error:", e);
    return NextResponse.json({ admin_password: "ipsum2025", admin_otp: "123456" });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json() as Record<string, string>;
    for (const [key, value] of Object.entries(body)) {
      await prisma!.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[settings] PUT error:", e);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}

