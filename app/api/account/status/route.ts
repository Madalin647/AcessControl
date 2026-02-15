import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function GET(req:Request){
  const h = await headers();
  const userId = h.get('x-user-id')

  const {searchParams} = new URL(req.url)

  const pId = searchParams.get('query');

  if(!pId || !userId){
    return NextResponse.json({error:"no project entered"})
  }

  const project = await prisma.project.findUnique({
    where:{
      id:+pId
    }
  })

  let status = 0;

  if(project?.uid == +userId){
    status =1
  }

  return NextResponse.json({data:status})
}

