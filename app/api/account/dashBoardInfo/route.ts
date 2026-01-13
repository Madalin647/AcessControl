import { NextResponse } from "next/server";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function GET(){

   const headersList =await headers()
  const userId = headersList.get('x-user-id')

if(userId){
  const user = await prisma.user.findUnique({
    where:{
      id:+userId,
    }
  })


  return new NextResponse(JSON.stringify({data:user}))

}
}