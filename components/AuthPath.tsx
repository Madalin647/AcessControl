"use client"
import Link from "next/link"
import "@/styles/navbar.css"

export default function AuthPath() {
  return (
     <div className="auth-paths">
        <Link href={'/Dashboard'} onClick={()=>{
          sessionStorage.setItem('auth','signup')
        }}>Sign up</Link>
        <div className="bracket-line"></div>
        <Link href={'/Dashboard'} onClick={()=>{
          sessionStorage.setItem('auth','login')
        }}>Login</Link>
      </div>
  )
}
