import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken"
import {hashSync} from "bcrypt"

export async function POST(req: Request){
 const {username,password}  = await req.json()

 if (!process.env.JWT_SECRET) {
     return NextResponse.json(
      { error: "JWT_SECRET not defined" },
      { status: 401 } )
  }

 const hashPassword = hashSync(password,8)

 try{
  const user =await prisma.user.create({
    data:{
      username,
      password:hashPassword
    }
  })
  const token = jwt.sign({id:user.id},process.env.JWT_SECRET,{expiresIn:'24h'})

  const response = NextResponse.json({success:true});

  response.cookies.set({
    name:'token',
    value:token,
    httpOnly:true,
    secure:false,
    sameSite:"lax",
    path:'/',
    maxAge: 60 * 60 * 24,
  })

  return response

 }catch(err){
  console.log(err)
  return NextResponse.json(
   { error: "Username already in use or server error" },
   { status: 401 } )
 }



}