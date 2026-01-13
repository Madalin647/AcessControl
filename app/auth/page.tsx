"use client"
import { useState,useContext } from "react";
import "@/styles/authPage.css"
import Link from "next/link";
import Image from "next/image";
import { ThemeContext } from "@/components/ThemeContext";

export default function AuthPage() {

 const {theme} = useContext(ThemeContext) ?? { theme: 'light', toggleTheme: () => {} }

  const pic = theme==='dark'?"/back-white.svg":'/back-black.svg'
  const visibility  = theme==='light'?"/eye-white.svg":'/eye-black.svg'

  const [showPassword, setShowPassword] = useState("password");

  const [way,setWay] = useState("");
   const currentWay = sessionStorage.getItem('auth') || "" ;
   
   if( !(way ===currentWay)){
   setWay(currentWay)
   }

   const [err,setErr] = useState("")

   const [username,setUsername] = useState("");
   const [password,setPassword] = useState("");
  
  const Validation = async(e: React.FormEvent<HTMLFormElement>)=>{
   e.preventDefault()

    if(!(username && password)){
      setErr("Username or password not specified")
    }else{
      if(username.length<3){
        setErr("Username has to be 3 characters or longer")
      }else{
        if(password.length<8){
          setErr("Password has to be 8 characters or longer")
        }else{
          setErr('')
          const data = {username,password}
        const res = await fetch('http://localhost:3000/api/' + way, {
          method:"POST",
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include'
        });
        const d = await res.json();
        
        if (!res.ok) {
          setErr(d.error);
          return;
        }
        
         window.location.href = '/Dashboard';

        }
      }
    }

  }

  return (<>

    <Link href={'/'} className="go-back"><Image src={pic} alt="go back" width={40} height={40} /> </Link>

    <div className="centerer">
    <section className="auth-body">
      <form onSubmit={Validation} className="form-body">
      <h3 className="f-header">{way==="signup"?"Sign Up":"Login"}</h3>
      <p className="error">{err}</p>
      <div className="input-body">
        <input type="text" className="credentials" placeholder="Username" 
        onChange={(e)=>{setUsername(e.target.value)}}
        />
        
        <div className="credentials">
        <input type={showPassword}  placeholder="Password" className="password"
         onChange={(e)=>{setPassword(e.target.value)}}
        />
        <button 
        type="button"
        className="visibility"
        onClick={()=>{setShowPassword(showPassword === "password"? "text" : "password")}}
        >
          <Image src={visibility} alt="img" width={30} height={30}/>
          </button>
        </div>

        <button type="submit" className="button">Submit</button>
        </div>
      </form>

    </section>
    </div>
    </>
  )
}