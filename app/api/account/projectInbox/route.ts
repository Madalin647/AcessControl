import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request:Request) {

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");

  if(!query){
    return NextResponse.json({error:"Missing project id"}, {status:400})
  }

  try{
    const invites = await prisma.invite.findMany({
    where: {
      pId: +query,
    },
     orderBy: {
    createdAt: 'asc'
  }
  });

  const inviteOwner = await prisma.user.findMany({
    where:{
      id:{
        in: invites.map((u: {
            status: "PENDING" | "ACCEPTED" | "REJECTED";
            id: number;
            createdAt: Date;
            pId: number;
            sId: number;
            oId: number;
            respondedAt: Date | null;
        })=>(u.oId))
      }
    }
  })



  const projects = await prisma.project.findMany({
   where:{
    id: {
     in: invites.map((pr: {
         status: "PENDING" | "ACCEPTED" | "REJECTED";
         id: number;
         sId: number;
         pId: number;
         oId: number;
         createdAt: Date;
         respondedAt: Date | null;
     })=>(pr.pId))
    }
  }
  });

  const projectName = projects.map((project: {
      id: number;
      createdAt: Date;
      name: string;
      uid: number;
      updatedAt: Date;
  }) => ({
    id: project.id,
    name: project.name,
    uid: project.uid,
  }));

  const adminNames = await prisma.user.findMany({
    where: {
     id: {
        in: projects.map((p: {
            id: number;
            createdAt: Date;
            name: string;
            uid: number;
            updatedAt: Date;
        }) => p.uid)
      }
    },
  });


  const projectInfo = projectName.map((project)=>{
    const admin = adminNames.find((a: {
        id: number;
        createdAt: Date;
        username: string;
        password: string;
    }) => a.id === project.uid);
    return {
      ...project,
      adminName: admin ? admin.username : "Unknown"
    };
  })

  const data = invites.map((invite: {
      id: number;
      sId: number;
      pId: number;
      oId: number;
      createdAt: Date;
      respondedAt: Date | null;
      status: "PENDING" | "ACCEPTED" | "REJECTED";
  }) => {
    const project = projectInfo.find((p: {
        adminName: string;
        id: number;
        name: string;
        uid: number;
    }) => p.id === invite.pId);
    const owner = inviteOwner.find((o: {
        id: number;
        createdAt: Date;
        username: string;
        password: string;
    })=>o.id == invite.oId)
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

  return NextResponse.json({ data }, { status: 200 });


  }catch(err){
    return NextResponse.json({error:"Internal server error"}, {status:500})
  }


}