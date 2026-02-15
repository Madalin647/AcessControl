import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req:Request){


 const { searchParams } = new URL(req.url);

  const searchInfo = searchParams.get('query');

  if(!searchInfo){
    return NextResponse.json({error:"No project id accesed"})
  }

  const info = await prisma.project.findUnique({
    where:{
      id:+searchInfo
    }
  })
  return NextResponse.json({data:info?.name})

}