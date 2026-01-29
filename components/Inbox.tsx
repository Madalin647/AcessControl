"use client"
import "@/styles/inbox.css"
import { useState, useEffect } from "react"

const API_URL = process.env.API_URL || 'http://localhost:3000';

export default function Inbox() {

  type Invite = {
    id: number;
    createdAt: Date | string;
    oId: number;
    sId: number;
    pId: number;
    status: string;
    respondedAt: Date | string | null;
    project:{id:number; name:string; adminName:string} | null;
  }
  const [userId, setUserId] = useState<number | null>(null);
  const [invites,setInvites] = useState<Invite[]>([])

  useEffect(()=>{

  fetch(`${API_URL}/api/account/Inbox`, {
    method:'GET',
    headers:{
     'Content-Type':'application/json',
  }}).then(async(response)=>{
    const r = await response.json();
    setInvites(r.data);
    setUserId(parseInt(r.id));
    console.log(r.data)
  });

},[])

  return (<div className="Ibody">

    <section className="gotInvites invites">
    <p>Recived Invites</p>
    <label htmlFor="sort">Sort by:
    <select name="sort" id="Rsort" onChange={(e)=>{console.log(e.target.value)}}>
      <option value="1">Newest</option>
      <option value="2">Pending</option>
      <option value="3">Redponded</option>
    </select>
    </label>
    {invites.map((invite)=>{
      if( invite.oId === userId){
        return (
          <div key={invite.id} className="inviteCard">
            <p>{invite.project?.name}</p>
            <p>By: {invite.project?.adminName}</p>
            <p>{invite.status}</p>
          </div>
        )
      }
    })}
    </section>

    <div className="bracket"></div>

    <section className="sentInvites invites">
    <p>Sent Invites</p>
    <label htmlFor="sort">Sort by:
    <select name="sort" id="Ssort" onChange={(e)=>{console.log(e.target.value)}}>
      <option value="1">Newest</option>
      <option value="2">Pending</option>
      <option value="3">Redponded</option>
    </select>
    </label>
    </section>

    </div>
  )
}
