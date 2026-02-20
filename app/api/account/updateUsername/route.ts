import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request: Request) {
  const headersList =await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { username } = await request.json();
  if (!username || username.length < 3) {
    return NextResponse.json({ message: "Username must be at least 3 characters long" }, { status: 400 });
  }
  try {

    const user = await prisma.user.findUnique({ where: { username } });
    if (user) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: +userId },
      data: { username }
    });
    return NextResponse.json({ message: "Username updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update username" }, { status: 500 });
  }
}