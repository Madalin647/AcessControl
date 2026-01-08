import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { compareSync } from "bcrypt";

export async function POST(req: Request){
 const {username,password}  = await req.json()
 
 if (!process.env.JWT_SECRET){
     return NextResponse.json(
      { error: "JWT_SECRET not defined" },
      { status: 401 } )
 }

 try{
  const user = await prisma.user.findUnique({
      where:{username}
    })

    if(!user){
      return NextResponse.json(
  { error: "User doesn't exist" },
  { status: 401 } )
    }
    const passwordCheck = compareSync(password, user.password)
    if (!passwordCheck){
      return NextResponse.json(
  { error: "Wrong password" },
  { status: 401 } )
    }

    const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:"24h"})
    return new NextResponse(JSON.stringify(token))
 }catch(err){
 console.error(err);
 return new NextResponse(null, {status:503})
 }

}