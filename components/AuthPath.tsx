"use client"
import Link from "next/link"
import "@/styles/navbar.css"
import { useEffect, useState } from "react"
import { useRouter,usePathname } from "next/navigation"



export default function AuthPath() {
  
  const [path,setPath] = useState(0);

  const router = useRouter();
  const pathname = usePathname()

  useEffect(()=>{
   fetch(`/api/account/loggedIn`,{
       method:'GET',
      headers:{
       'Content-Type':'application/json',
      },
      credentials:'include',
    }).then(async(response)=>{
      const res = await response.json();
      if(res.data === 1){
      setPath(1)
      if(pathname === '/'){
      router.push('/Dashboard')
      }
      }
    })

  },[pathname, router])

  
  
   


  return (<>
{path?  <div className="auth-paths">
          <Link href={'/Dashboard'}>Dashboard</Link>
        </div>
        :
        <div className="auth-paths">
        <Link href={'/auth'} onClick={()=>{
          sessionStorage.setItem('auth','signup')
          router.refresh()
        }}>Sign up</Link>
        <div className="bracket-line"></div>
        <Link href={'/auth'} onClick={()=>{
          sessionStorage.setItem('auth','login')
          router.refresh()
        }}>Login</Link>
      </div>}

       
      </>
  )
}
