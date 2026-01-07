import { NextResponse } from "next/server";

export async function POST(req: Request){
 const value  = await req.json()
 console.log(value)

 return new NextResponse(JSON.stringify('got'))
}