"use client"
import { useState } from "react"
import AuthPage from "@/components/AuthPage";

export default function Home() {
 const [way,setWay] = useState("");
 const currentWay = sessionStorage.getItem('auth') || "" ;
 
 if( !(way ===currentWay)){
 setWay(currentWay)
 }

  return (
    way ==="user"?"no":<AuthPage/>
  )
}
