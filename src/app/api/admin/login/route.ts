import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = body.password || "";
  } catch { return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 }); }

  try {
    const row = await prisma.setting.findUnique({ where: { key: "admin_password" } });
    const valid = row?.value || "ipsum2025";
    if (password === valid) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "Invalid password" }, { status: 401 });
  } catch (e) {
    console.error("[login] DB error:", e);
    if (password === "ipsum2025") {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "Server error — try again later" }, { status: 500 });
  }
}
