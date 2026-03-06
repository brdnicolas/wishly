import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { nanoid } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true, description: true, slug: true },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // Auto-generate slug if requesting one and user doesn't have one
  if (body.generateSlug) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, slug: true },
    });

    if (user?.slug) {
      return NextResponse.json({ slug: user.slug });
    }

    const baseName = (user?.name || "user")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const slug = `${baseName}-${nanoid(6)}`;

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { slug },
      select: { slug: true },
    });

    return NextResponse.json(updated);
  }

  const data: Record<string, string | null> = {};
  if (body.name !== undefined) data.name = body.name || null;
  if (body.image !== undefined) data.image = body.image || null;
  if (body.description !== undefined) data.description = body.description || null;

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, name: true, email: true, image: true, description: true, slug: true },
  });

  return NextResponse.json(updated);
}
