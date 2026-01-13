"use client"

import { useState,useEffect } from "react"
import "@/styles/overview.css"

export default function Overview() {


  type User = {
  id: number;
  username: string;
  createdAt: Date | string; 
}

  const [data,setData] = useState<User>()

useEffect(()=>{
fetch("http://localhost:3000/api/account/dashBoardInfo", {
      method:'GET',
      headers:{
       'Content-Type':'application/json',
      },
      credentials:'include',
    }).then(async(response)=>{
      const r = await response.json();

      const res:User  = r.data

      const date = new Date(res.createdAt);
      const formatted = new Intl.DateTimeFormat('en-GB').format(date);

      res.createdAt = formatted;
      setData(res)
    })


},[]) 

  return (
  <div className="page-body">
    <section className="account-section">
      <div className="account-box">
        <p className="account-title">Account Info:</p>
        <p>Name: {data?.username}</p>
        <p>Id: {data?.id}</p>
        <p>Since: {data?.createdAt?.toString()}</p>
        <button className="button settings">Settings</button>
      </div>
    </section>
    <section className="last-projects-list">
       <div className="project"></div>
       <div className="project"></div>
       <div className="project"></div>
       <div className="project"></div>
       <div className="project"></div>
    </section>
  </div>
  )
}
