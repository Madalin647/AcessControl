"use client"

import "@/styles/project.css"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation";
import ProjectInfo from "@/components/projectInfo";
import Tasks from "@/components/tasks";
import ProjectInbox from "@/components/ProjectInbox";
import Image from "next/image";
import { useContext } from "react";
import { ThemeContext } from "@/components/ThemeContext";
import MessageBox from "@/components/MessageBox";

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"



export default function Page() {

  const {theme} = useContext(ThemeContext) as {theme:string}

  const pic = theme == 'light' ? '/back-black.svg' : '/back-white.svg'

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

  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <div className="pr-body">
     
    <div className={`project-content ${messageOpen ? 'open' : ''}`}>
      <section className="pr-select">
        <button className="direct" onClick={()=>{setSelected(1)}}>Info</button>
        <button className="direct" onClick={()=>{setSelected(2)}}>Tasks</button>
     {ownerShip?   <button className="direct" onClick={()=>{setSelected(3)}}>Inbox</button> : ''}
      </section>
      {selected == 1 ? <ProjectInfo/> : selected == 2 ? <Tasks/>: <ProjectInbox/>}
    </div>
    <aside className={`message-box ${messageOpen ? 'open' : ''}`}>
      <MessageBox />
    </aside>
    <button className="message-box-popup" onClick={()=>setMessageOpen(prev => !prev)}><Image src={pic} alt="messages" width={30} height={30}/></button>
    
    </div>
  )
}
