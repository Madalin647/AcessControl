import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET(){
  const headersList = await headers();
  const UserId = headersList.get("x-user-id");

  if(!UserId){
    return NextResponse.json({error:"No user signed in"})
  }

  const projects = await prisma.project.findMany({
    where:{

      OR:[{uid:+UserId}, {members:{
        some:{
          uId:+UserId,
        }
      }}]
     
    },
    include:{
      members:true,
    },
  })


  const owner = await prisma.user.findMany({
    where:{
      id:{
        in: projects.map((e)=> e.uid)
      }
    }
  }) 

  const owners = owner.map((e)=>{
    return({
      username:e.username,
      id:e.id
    })
  })



const memberIds = projects.flatMap(p => p.members?.map(m => m.uId) ?? []);
const uniqueMemberIds = Array.from(new Set(memberIds));

const unrepetedMemberIds = [...new Set(uniqueMemberIds)]

const membersData = await prisma.user.findMany({
  where: {
    id: { in: unrepetedMemberIds }
  }
});



  const members = membersData.map((e)=>{

    const pid = projects.flatMap(p=> p.members?.map(m=>{
      if(m.uId == e.id){
        return m.pId
      }
    }))

    return{
      username:e.username,
      pids:pid,
    }
  })

  
  const data = projects.map((p)=>{

    const owner = owners.find((i)=>i.id == p.uid)


     const founded = members.find((e)=>e.pids.includes(p.id))

    const m = founded ? [founded] : [];
  


    return{
      id:p.id,
      name:p.name,
      owner:owner || "",
      members:m,
      timestamp:p.createdAt,
    }
  })


  return NextResponse.json({data, id:UserId})
}