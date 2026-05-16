import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma!.template.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[templates] DELETE error:", e);
    return NextResponse.json({ ok: false, error: "Database error" }, { status: 500 });
  }
}
