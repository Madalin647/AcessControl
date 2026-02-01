import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { error } from "console";

export async function GET() {

    const headersList =await headers();
  const userId = headersList.get("x-user-id");


  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invites = await prisma.invite.findMany({
    where: {
      OR: [{ oId: +userId }, { sId: +userId }],
    },
     orderBy: {
    createdAt: 'asc'
  }
  });

  const inviteOwner = await prisma.user.findMany({
    where:{
      id:{
        in: invites.map((u)=>(u.oId))
      }
    }
  })



  const projects = await prisma.project.findMany({
   where:{
    id: {
     in: invites.map((pr)=>(pr.pId))
    }
  }
  });

  const projectName = projects.map((project) => ({
    id: project.id,
    name: project.name,
    uid: project.uid,
  }));

  const adminNames = await prisma.user.findMany({
    where: {
     id: {
        in: projects.map((p) => p.uid)
      }
    },
  });


  const projectInfo = projectName.map((project)=>{
    const admin = adminNames.find((a) => a.id === project.uid);
    return {
      ...project,
      adminName: admin ? admin.username : "Unknown"
    };
  })

  const data = invites.map((invite) => {
    const project = projectInfo.find((p) => p.id === invite.pId);
    const owner = inviteOwner.find((o)=>o.id == invite.oId)
    return {
      id: invite.id,
      pId: invite.pId,
      oId: invite.oId,
      sId: invite.sId,
      createdAt: invite.createdAt,
      respondedAt: invite.respondedAt,
      status: invite.status,
      owner: owner?.username,
      project: project ? { id: project.id, name: project.name, adminName: project.adminName } : null
    };
  });

  return NextResponse.json({ data , id: userId}, { status: 200 });
}

export async function POST(res:Request){
  const data =await res.json();

  const headersList =await headers();
  const userId = headersList.get("x-user-id");
  
  if(data.value == 'a'){

    if(!userId){
      return NextResponse.json({error:'Could not accept invite'})
    }

    const invite = await prisma.invite.update({
      where: { id: +data.id},
      data: {status: "ACCEPTED"}
    })

    await prisma.projectMember.create({
      data:{
        uId:+userId,
        pId:invite.pId,
      }
    })

    return NextResponse.json({data:invite})
  }
  if(data.value == 'r'){
     const invite = await prisma.invite.update({
      where: { id: +data.id},
      data: {status: "REJECTED"}
    })
    return NextResponse.json({data:invite})
  }
  
  if(data.value == 'c'){
    await prisma.invite.delete({
      where:{id: +data.id}
    })

    return NextResponse.json({data:1})
  }

  return NextResponse.json({status:404})
}