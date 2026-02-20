"use client"

import "@/styles/Settings.css"
import { useState,useEffect } from "react";
import { DELETE } from "@/components/deleteCookie";


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';



export default function Page() {

  const [changePassword, setChangePassword] = useState(false);
  const [changeUsername, setChangeUsername] = useState(false);

   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

   const usernameCheck = async (name:string)=>{
    if(name.length < 3) return alert("Username must be at least 3 characters long");
     await fetch(`${API_URL}/api/account/updateUsername`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({username: name})
    }).then(async (res)=> {
      if(res.status === 200) {
        alert("Username updated successfully");
        setChangeUsername(false);
        setUsername("");
      } else {
        const data = await res.json();
        alert(data.message);
      }
     })
   }

   const passwordCheck = async (pass:string)=>{
    if(pass.length < 8) return alert("Password must be at least 8 characters long");
     await fetch(`${API_URL}/api/account/updatePassword`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({password: pass})
    }).then(async (res)=> {
      if(res.status === 200) {
        alert("Password updated successfully");
        setChangePassword(false);
        setPassword("");
      } else {
        const data = await res.json();
        alert(data.message);
      }
     })
    }
   
  
  return (
    <main className="settings-main">
      <h2>Settings</h2>
      <button className="s-button">Delete projects</button>
      <button className="s-button" onClick={() => setChangeUsername(!changeUsername)}>Change username</button>
      {changeUsername && <div className="setting-change">
        <input className="s-input" type="text" placeholder="Change Username" onChange={(e)=> {setUsername(e.target.value)
        }}/>
        <button className="c-button" onClick={()=> usernameCheck(username)}> {username && "✓"} </button>
        </div>}
      <button className="s-button" onClick={() => setChangePassword(!changePassword)}>Change password</button>
      {changePassword && <div className="setting-change">
        <input className="s-input" type="text" placeholder="Change Password" onChange={(e)=> setPassword(e.target.value)}/>
        <button className="c-button" onClick={()=> passwordCheck(password)}>{password && "✓"}</button>
        </div>}
      <button className="s-button" onClick={() => {
        DELETE();
        sessionStorage.removeItem("dashboardContent");
        window.location.href = "/";}}>Log off</button>
    </main>
  )
}
