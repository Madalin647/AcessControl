"use client"
import "@/styles/inbox.css"
import { useState, useEffect } from "react"
import Select, { CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export default function Inbox() {

  const customStyles = {
    control: (base: CSSObjectWithLabel, state: ControlProps<{ value: string; label: string }, false, GroupBase<{ value: string; label: string }>>) => ({
      ...base,
      backgroundColor: 'transparent',
      border:'none',
      borderColor: state.isFocused ? 'var(--foreground)' : '#ffffff00',
      borderWidth: state.isFocused ? '2px' : '1px',
      boxShadow: state.isFocused ? '0 0 0 1px var(--foreground)' : 'none',
      '&:hover': {
      borderColor: state.isFocused ? '#4CAF50' : '#999'
    }
    }),
    menu: (base: CSSObjectWithLabel) => ({
    ...base,
    color: 'var(--foreground)',
    opacity:1,
    backgroundColor: 'var(--background)'
  }),
  option: (base: CSSObjectWithLabel, state: OptionProps<{ value: string; label: string }, false, GroupBase<{ value: string; label: string }>>) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? 'rgba(27, 127, 235, 0.88)'
      : state.isFocused 
      ? 'rgba(223, 223, 223, 0.2)' 
      : 'transparent',
  }),
  }

  const options = [
    {value:"1" , label:"Newest"},
    {value:"PENDING" , label:"Pending"},
    {value:"3" , label:"Responded"}
  ]

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
    owner:string,
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

    const interval = setInterval(()=>{
    fetch(`${API_URL}/api/account/Inbox`, {
       method:'GET',
        headers:{
         'Content-Type':'application/json',
     }}).then(async(response)=>{
       const r = await response.json();
       setInvites(r.data);
       setUserId(parseInt(r.id));
     });
    },3000)

  return()=>clearInterval(interval)

},[])

 async function inviteAction(value:string , id:number) {
   const data = {value, id}
   await fetch(`${API_URL}/api/account/Inbox`,{
    method:'POST',
    headers:{
      'Content-Type':'application/json',
    },
    body: JSON.stringify(data)
   }).then(async(response)=>{
    const r = await response.json();

    if(r.data == 1){
     const newInvites = invites.filter((i)=>i.id != data.id)
     setInvites(newInvites)
    }else {
      const newInvites = invites.map((i)=>{
      if(i.id == r.data.id){
      i.status = r.data.status
      }
      return i
    })
    setInvites(newInvites)
  }
   })
 }

  return (<div className="Ibody">

    <section className="gotInvites invites">
    <p>Recived Invites</p>
    <div className="sort-component">
    <p>Sort By:</p>
    <Select 
    value={options.find(opt => opt.value === rValue) || options[0]}
    options={options}
    onChange={(e)=>{setRValue(e?.value || '1')}}
    styles={customStyles}
    />
    </div>
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
            <p className="card-info">{invite.project?.name}</p>
            <p className="card-info">By: {invite.project?.adminName}</p>
            </div>
            <p>{invite.status}</p>
             {invite.status=="PENDING"? 
            <div>
              <button className="invite-action">	&#10003;</button>
              <button className="invite-action">X</button>
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
              <button className="invite-action invite-accept" onClick={()=>{inviteAction('a',invite.id)}}>	&#10003;</button>
              <button className="invite-action invite-reject" onClick={()=>{inviteAction('r',invite.id)}}>X</button>
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
    <div className="sort-component">
    <p>Sort By:</p>
    <Select 
    value={options.find(opt => opt.value === sValue) || options[0]}
    options={options}
    onChange={(e)=>{setSValue(e?.value || '1')}}
    styles={customStyles}
    />
    </div>
    <section className="invite-grid">   
    {invites && invites.map((invite)=>{

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
            <p>To: {invite.owner}</p>
            </div>
            <p>{invite.status}</p>
              {invite.status=="PENDING"? 
            <div>
              <button className="invite-action">X</button>
            </div>:""}
          </div>
        )
        else if(sValue == "1")
           return (
          <div key={invite.id} className="inviteCard">
            <div>
            <p>{invite.project?.name}</p>
            <p>To: {invite.owner}</p>
            </div>
            <p>{invite.status}</p>
              {invite.status=="PENDING"? 
            <div>
              <button className="invite-action invite-cancel" onClick={()=>{inviteAction('c',invite.id)}}>X</button>
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
