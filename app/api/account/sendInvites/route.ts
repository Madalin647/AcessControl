import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request:Request){

  const header = await headers();
  const userId = header.get('x-user-id');

  if(!userId){
    return NextResponse.json({message:"Unauthorized"}, {status:401})
  }


    const {projectId, invites} = await request.json();

   try{
    if(invites.length > 0){

  await prisma.invite.createMany({
    data: invites.map((invite: { id: string }) => ({
      pId: +projectId,
      sId: +userId,
      oId: +invite.id,
    })),
  })
  }
  return NextResponse.json({message:"Invites sent"}, {status:200})
   }catch(err){
      console.log(err);
      return NextResponse.json({message:"Error sending invites"}, {status:500})
   }

  }