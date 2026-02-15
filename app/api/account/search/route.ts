import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {

   const headersList =await headers()
  const userId = headersList.get('x-user-id')

  const { searchParams } = new URL(req.url);

  const searchInfo = searchParams.get('query');

  if (!searchInfo) {
    return NextResponse.json({ data: [] });
  }

  const results = await prisma.user.findMany({
    where: {
      OR: [
        {username: { contains: searchInfo , mode: 'insensitive' }},
      ]}})

      const definedResults = results.map((user) => {return {id: user.id, username: user.username}});


      const filteredResults = definedResults.filter((user) => user.id.toString() !== userId);


  return NextResponse.json({ data: filteredResults });
}