import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req:Request){
  const ids = await req.json();

  if(!ids){
    return NextResponse.json({error:"no projects selected for deletion"},{status:501})
  }

  try{
    await prisma.project.deleteMany({
      where:{
        id:{
          in:ids.map((i:number)=> {return i})
        }
      }
    })

    return NextResponse.json({status:200})

  }catch(err){
    return NextResponse.json({message:`Failed to complete request, error:${err}`  },{status:501})
  }
}