import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {

  const headersList =await headers()
  const userId = headersList.get('x-user-id')

  if(!userId){
    return NextResponse.json({data:0})
  }

  const { title, invites, tasks } = await req.json();

  try {

 const project = await prisma.project.create({
    data: {
      uid: +userId,
      name: title,
    },
  });

  const projectId = project.id;

  if(invites.length > 0){

  await prisma.invite.createMany({
    data: invites.map((invite: { id: string }) => ({
      pId: projectId,
      sId: +userId,
      oId: +invite.id,
    })),
  })
  }

  if(tasks.length > 0){

  await prisma.task.createMany({
    data: tasks.map((t: { name: string; description: string })=> ({
      pid: projectId,
      title: t.name,
      content: t.description,
      uid: +userId,
    })),
  });
  }

  return NextResponse.json({ data: 1 });

  } catch (error){
    console.error("Error creating project:", error);
    return NextResponse.json({ data: 0 });
  }

}