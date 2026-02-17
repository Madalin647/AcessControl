import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
 const {title,description,pid} = await req.json();

  let des = description;

 if(description === " "){
  des =""
 }

  if(!title || !description || !pid){
    return NextResponse.json({message:"Missing required fields"}, {status:400})
  }

  try{
    const project = await prisma.project.findUnique({
      where:{
        id: +pid,
      }
    })
    if(!project){
      return NextResponse.json({message:"Project not found"}, {status:404})
    }


     await prisma.task.create({
      data:{
        title,
        content:des,
        pid: +pid,
        uid: project?.uid,}})

    return NextResponse.json({message:"Task created successfully"}, {status:201})

}catch(error){
  console.error("Error creating task:", error);
  return NextResponse.json({message:"Internal Server Error"}, {status:500})}
}