import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(){
  const headersList = await headers();
  const UserId = headersList.get("x-user-id");

  


  return NextResponse.json({data:1})
}