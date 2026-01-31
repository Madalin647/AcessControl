"use client"
import "@/styles/inbox.css"
import { useState, useEffect } from "react"

const API_URL = process.env.API_URL || 'http://localhost:3000';

export default function Inbox() {

  const [rValue, setRValue] = useState('1')
  const [sValue,setSValue] = useState('1')


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
  });

},[])

  return (<div className="Ibody">

    <section className="gotInvites invites">
    <p>Recived Invites</p>
    <label htmlFor="sort">Sort by:
    <select className="sort" name="sort" id="Rsort" onChange={(e)=>{setRValue(e.target.value)}}>
      <option value="1">Newest</option>
      <option value="PENDING">Pending</option>
      <option value="3">Redponded</option>
    </select>
    </label>
    <section className="invite-grid">
    {invites.map((invite)=>{

      let status = "PENDING"

      if(invite.status == "ACCEPTED" || invite.status == "REJECTED"){
       status = "3"
      }

      if( invite.oId === userId){
        if(rValue == status)
        return (
          <div key={invite.id} className="inviteCard">
            <div>
            <p>{invite.project?.name}</p>
            <p>By: {invite.project?.adminName}</p>
            </div>
            <p>{invite.status}</p>
             {invite.status=="PENDING"? 
            <div>
              <button></button>
              <button>X</button>
            </div>:""}
          </div>
        )
        else if(rValue == "1")
           return (
          <div key={invite.id} className="inviteCard">
            <div>
            <p>{invite.project?.name}</p>
            <p>By: {invite.project?.adminName}</p>
            </div>
            <p>{invite.status}</p>
            {invite.status=="PENDING"? 
            <div>
              <button></button>
              <button>X</button>
            </div>:""}
          </div>
        )
      }
    })}
    </section>
    </section>

    <div className="brac"></div>

    <section className="sentInvites invites">
    <p>Sent Invites</p>
    <label htmlFor="sort">Sort by:
    <select className="sort" name="sort" id="Ssort" onChange={(e)=>{setSValue(e.target.value)}}>
      <option value="1">Newest</option>
      <option value="PENDING">Pending</option>
      <option value="3">Redponded</option>
    </select>
    </label>
    <section className="invite-grid">   
    {invites.map((invite)=>{

      let status = "PENDING"

      if(invite.status == "ACCEPTED" || invite.status == "REJECTED"){
       status = "3"
      }

      if( invite.sId === userId){
        if(sValue == status)
        return (
          <div key={invite.id} className="inviteCard">
            <div>
            <p>{invite.project?.name}</p>
            </div>
            <p>{invite.status}</p>
              {invite.status=="PENDING"? 
            <div>
              <button>X</button>
            </div>:""}
          </div>
        )
        else if(sValue == "1")
           return (
          <div key={invite.id} className="inviteCard">
            <div>
            <p>{invite.project?.name}</p>
            </div>
            <p>{invite.status}</p>
              {invite.status=="PENDING"? 
            <div>
              <button>X</button>
            </div>:""}
          </div>
        )
      }
    })}
    </section>
    </section>

    </div>
  )
}
