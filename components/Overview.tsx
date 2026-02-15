"use client"

import { useRouter } from "next/navigation";
import { useState,useEffect } from "react"
import "@/styles/overview.css"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Overview() {

  const route = useRouter();

  type User = {
  id: number;
  username: string;
  createdAt: Date | string; 
}

  const [data,setData] = useState<User>()

useEffect(()=>{
fetch(`${API_URL}/api/account/dashBoardInfo`, {
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


  type project={
      id:number,
      name:string,
      owner:{id:number, username:string} ,
      members:[{username:string, pids:[number]}],
      timestamp:Date | string | null,
  }

 const [projects, setProjects] = useState<project[]>([])

  useEffect(()=>{
    fetch(`${API_URL}/api/account/lastProjects`,{
      method:"GET",
      headers:{
         'Content-Type':'application/json',
     }
    }).then(async(response)=>{
      const r = await response.json();
      console.log(r.data)
      setProjects(r.data)
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
      {projects.map((p)=>{

      const date = p.timestamp ? new Date(p.timestamp) : new Date();
      const formatted = new Intl.DateTimeFormat('en-GB').format(date);

      const element = <div key={p.id} className="pr lpr">
          <div className="card-section">
            <p>{p.name}</p>
            <p>By: {p.owner.username}</p>
          </div>
          <div className="additional">
          <p className="card-section info">Info ?</p>
          <div className="additional-data">
            <p>From: {formatted}</p>
            <p>Members:</p>
            {p.members?.map((e)=>{
              return(
                <p key={e.pids[0]}>{e.username}</p>
              )
            })}
            </div>
          </div>
          <div className="card-section enter">
            <button className="button enter-button" onClick={()=>{route.push(`/project/${p.id}`)}}>Enter</button>
          </div>
        </div>

     return element

     

     })}
    </section>
  </div>
  )
}
