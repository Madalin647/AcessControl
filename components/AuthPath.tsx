"use client"
import Link from "next/link"
import "@/styles/navbar.css"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPath() {
  
  const [path,setPath] = useState(0);

  const router = useRouter()

  useEffect(()=>{
   fetch('http://localhost:3000/api/account/loggedIn',{
       method:'GET',
      headers:{
       'Content-Type':'application/json',
      },
      credentials:'include',
    }).then(async(response)=>{
      const res = await response.json();
      if(res.data === 1){
      setPath(1)
      router.push('/Dashboard')
      }
    })

  },[])

  
  
   


  return (<>
{path?  <div className="auth-paths">
          <Link href={'/Dashboard'}>Dashboard</Link>
        </div>
        :
        <div className="auth-paths">
        <Link href={'/auth'} onClick={()=>{
          sessionStorage.setItem('auth','signup')
        }}>Sign up</Link>
        <div className="bracket-line"></div>
        <Link href={'/auth'} onClick={()=>{
          sessionStorage.setItem('auth','login')
        }}>Login</Link>
      </div>}

       
      </>
  )
}
