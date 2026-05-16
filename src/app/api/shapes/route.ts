import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const shapes = await prisma!.shape.findMany({ orderBy: { createdAt: "asc" } });
    return NextResponse.json(shapes);
  } catch (e) {
    console.error("[shapes] GET error:", e);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const shape = await prisma!.shape.create({
      data: {
        name: body.name || "Unnamed",
        category: body.category || "Geometric",
        svgContent: body.svgContent,
      },
    });
    return NextResponse.json(shape, { status: 201 });
  } catch (e) {
    console.error("[shapes] POST error:", e);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

