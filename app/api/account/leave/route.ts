import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(request:Request) {

    const headersList =await headers();
    const userId = headersList.get("x-user-id");

    const {id} = await request.json();
  
    if(!id || !userId){
        return NextResponse.json({message:"Project is not existent or user is not authenticated"}, {status:400})
    }

    try{
       await prisma.projectMember.delete({
        where:{
          uId_pId:{
            pId:+id,
            uId:+userId
          }
        }
       })

        return NextResponse.json({message:"Project member removed successfully"}, {status:200})

    }catch(err){
        console.error("Error leaving project:", err);
        return NextResponse.json({message:"An error occurred while leaving the project"}, {status:500})
    }
  
  }