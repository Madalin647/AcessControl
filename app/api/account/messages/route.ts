import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";


export async function GET(req:Request){
  const {searchParams} = new URL(req.url)
  const pId = searchParams.get("query")

    const header =await headers()
    const userId = header.get("x-user-id")

  if(!userId){
    return NextResponse.json({error:"Unauthorized"},{status:401})
  }

  try{
  const messages = await prisma.message.findMany({
    where:{
      pid:+pId!
    },
    orderBy:{
      createdAt:"asc"
    }
  })
  
  const senders = await prisma.user.findMany({
    where:{
      id:{
        in: messages.map((m: {
            id: number;
            sender: number;
            pid: number;
            content: string;
            createdAt: Date;
            updatedAt: Date;
        }) => m.sender)
      }
    },
      })

  const messagesWithSenders = messages.map((m: {
      id: number;
      sender: number;
      pid: number;
      content: string;
      createdAt: Date;
      updatedAt: Date;
  }) => {
    const sender = senders.find((s: {
        id: number;
        createdAt: Date;
        username: string;
        password: string;
    }) => s.id === m.sender)
    return {
      id:m.id,
      content:m.content,
      name: sender ? sender.username : "Unknown",
      sId:sender ? sender.id : 0
    }
  })

  return NextResponse.json({messages:messagesWithSenders, userId}, {status:200})
 }catch(err){
    console.log(err)
    return NextResponse.json({error:"Error sending message"},{status:500})
  }

}