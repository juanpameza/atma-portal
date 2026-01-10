import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const email = (body.email as string)?.toLowerCase().trim();
  const password = body.password as string;
  const name = (body.name as string | undefined)?.trim();

  if (!email || !password || password.length < 8) {
    return NextResponse.json(
      { error: "Email required and password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ error: "Email already in use." }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { email, password: hashed, name: name || null },
  });

  return NextResponse.json({ ok: true });
}