"use client"

import MenuBar from "@/components/MenuBar"
import { useState } from "react"
import "@/styles/dashboard.css"
import Link from "next/link"
import Overview from "@/components/Overview"
import Inbox from "@/components/Inbox"
import Projects from "@/components/Projects"

export default function Home() {

  const [content,setContent] =   useState("")
  if (typeof window !== "undefined") {
 setContent(  (sessionStorage.getItem("dashboardContent") as string) ||"overview")
}

  function Selector(way:string){
   setContent(way);   
  }




  return (
    <>
    <MenuBar>
      <button onClick={()=>{Selector('overview'); sessionStorage.setItem("dashboardContent", "overview")}} className="direct">Overview</button>
      <button onClick={()=>{Selector('projects'); sessionStorage.setItem("dashboardContent", "projects")}} className="direct">Projects</button>
      <Link href={'/Create'} className="direct">New Project</Link>
      <button onClick={()=>{Selector('inbox'); sessionStorage.setItem("dashboardContent", "inbox")}} className="direct">Inbox</button>
    </MenuBar>

    {content ==='overview'? <Overview/>:content==='projects'?<Projects/>:<Inbox/>}
    </>
  )
}
