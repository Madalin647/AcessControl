"use client"

import "@/styles/project.css"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import ProjectInfo from "@/components/projectInfo";
import Tasks from "@/components/tasks";

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"



export default function Page() {

 const params = useParams();
 const id = params.id;

  const [selected, setSelected] = useState<number>(1)

  const [ownerShip,setOwnerShip] = useState<number>(0)

  useEffect(()=>{
    fetch(`${API_URL}/api/account/status?query=${id}`,{
      method:"GET",
      headers:{
        'Content-Type':'application/json',
      }
    }).then(async(response)=>{
      const r = await response.json()
      console.log(r.data)
      setOwnerShip(r.data)
    })
  },[id])



  return (
    <div className="pr-body">
    <div className="project-content">
      <section className="pr-select">
        <button className="direct" onClick={()=>{setSelected(1)}}>Info</button>
        <button className="direct" onClick={()=>{setSelected(2)}}>Tasks</button>
     {ownerShip?   <button className="direct" onClick={()=>{setSelected(3)}}>Inbox</button> : ''}
      </section>
      {selected == 1 ? <ProjectInfo/> : selected == 2 ? <Tasks/>: 'inbox'}
    </div>
    <aside className='message-box'></aside>
    </div>
  )
}
