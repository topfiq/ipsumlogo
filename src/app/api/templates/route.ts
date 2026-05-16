import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const templates = await prisma!.template.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(templates);
  } catch (e) {
    console.error("[templates] GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const template = await prisma!.template.create({
      data: {
        name: body.name || "Unnamed",
        state: body.state,
        preview: body.preview,
      },
    });
    return NextResponse.json(template, { status: 201 });
  } catch (e) {
    console.error("[templates] POST error:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

