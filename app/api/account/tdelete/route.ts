import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const {ids} = await req.json();
 
  if(!ids || !Array.isArray(ids)){
    return NextResponse.json({message:"Invalid request"}, {status:400})
  }

  try {
    await prisma.task.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    return NextResponse.json({message:"Tasks deleted successfully"}, {status:200})
  } catch (error) {
    return NextResponse.json({message:`Error deleting tasks: ${error}`}, {status:500})
  }

}