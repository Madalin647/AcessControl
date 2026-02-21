import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req:Request){

  const {searchParams} = new URL(req.url)

  const pId = searchParams.get('query');

  if(!pId){
    return NextResponse.json({error:"no project entered"})
  }

  const project = await prisma.project.findUnique({
    where:{
      id:+pId
    },
    include:{members:true}
  })

  if(!project){
    return NextResponse.json({error:"no project found"})
  }

   const owner = await prisma.user.findUnique({
    where:{
      id:project.uid
    }
  })
 
  const members = await prisma.user.findMany({
    where:{
      id:{
        in:project.members.map((e:{ id: number;
    pId: number;
    joinedAt: Date;
    uId: number;})=> e.uId)
      }
    }
  })

  const membersName = members.map((e: {
      id: number;
      createdAt: Date;
      username: string;
      password: string;
  })=> e.username)



  const data = {
    id:project.id,
    createdAt:project.createdAt,
    name:project.name,
    lastUpdate:project.updatedAt,
    admin:owner?.username,
    members:membersName,
  }



  return NextResponse.json({data})
}