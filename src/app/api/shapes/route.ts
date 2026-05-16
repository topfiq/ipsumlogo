import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const shapes = await prisma.shape.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(shapes);
}

export async function POST(request: Request) {
  const body = await request.json();
  const shape = await prisma.shape.create({
    data: {
      name: body.name || "Unnamed",
      category: body.category || "Geometric",
      svgContent: body.svgContent,
    },
  });
  return NextResponse.json(shape, { status: 201 });
}
