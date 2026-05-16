import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(templates);
}

export async function POST(request: Request) {
  const body = await request.json();
  const template = await prisma.template.create({
    data: {
      name: body.name || "Unnamed",
      state: body.state,
      preview: body.preview,
    },
  });
  return NextResponse.json(template, { status: 201 });
}
