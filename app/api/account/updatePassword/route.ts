import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  const headersList =await headers();
  const userId = headersList.get("x-user-id");

  const { password } = await request.json();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (!password || password.length < 8) {
    return NextResponse.json({ message: "Password must be at least 8 characters long" }, { status: 400 });
  }

  try{
    const hashedPassword = await bcrypt.hash(password, 8);

    await prisma.user.update({
      where: { id: +userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
  }catch(error) {
    return NextResponse.json({ message: "Failed to update password" }, { status: 500 });
  }

}