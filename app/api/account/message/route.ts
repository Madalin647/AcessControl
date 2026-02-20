import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req:Request){
  const body = await req.json()
  const header =await headers()
  const userId = header.get("x-user-id")
  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401})
  }
  try{
  await prisma.message.create({
    data:{
      content:body.message,
      pid:+body.pId,
      sender:+userId
    }
  })
  return NextResponse.json({message:"Message sent"}, {status:200})
 }catch(err){
    console.log(err)
    return NextResponse.json({error:"Error sending message"},{status:500})
  }

}