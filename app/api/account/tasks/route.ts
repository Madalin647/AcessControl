import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req:Request){

  const {searchParams} = new URL(req.url);

  const id = searchParams.get('query')

  if(!id){
    return NextResponse.json({error:"no project entered"})
  }

  const tasks = await prisma.task.findMany({
    where:{
      pid: +id,
    },
    orderBy:[
     { createdAt:'asc'},
     { status:'desc'},
    ]
  })

  return NextResponse.json({data: tasks})
}

export async function POST(req:Request) {

  const {value} = await req.json();

  
  const {searchParams} = new URL(req.url);

  const id = searchParams.get('query');

  if(!id){
    return NextResponse.json({error:"no project entered"})
  }

  await prisma.task.update({
    where:{
      id: +id,
    },
    data:{
      status: value,
    }
  })

  return NextResponse.json({status:201})
}