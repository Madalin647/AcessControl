import "@/styles/projectInbox.css"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"

export default function ProjectInbox() {

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
    const [invites,setInvites] = useState<Invite[]>([])
    const [sendInvite, setSendInvite] = useState<{id:string, username:string}[]>([]);
 
  const params = useParams();
  const id = params.id;

   function addInvite(user:{id:string, username:string}){
    if(!sendInvite.find(u=>u.id === user.id)){
      setSendInvite([...sendInvite, user]);
    }
  }

  function deleteInvite(id:string){
    setSendInvite(sendInvite.filter(u=>u.id !== id));
  }

  useEffect(()=>{
      fetch(`${API_URL}/api/account/projectInbox?query=${id}`,{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
        }
      }).then(async(response)=>{
        const r = await response.json()
        setInvites(r.data);
        })
      },[id])

      useEffect(()=>{
        const interval = setInterval(()=>{
          fetch(`${API_URL}/api/account/projectInbox?query=${id}`,{
            method:"GET",
            headers:{
              'Content-Type':'application/json',
            }
          }).then(async(response)=>{
            const r = await response.json()
            setInvites(r.data);
            })
          },3000)

          return () => clearInterval(interval);
      })

      const [searchResults, setSearchResults] = useState<{id:string, username:string}[]>([]);
      
      
        async function searchHandler(value:string){
          await fetch(`${API_URL}/api/account/search?query=${value}`, {
            method: 'GET',
            headers:{
             'Content-Type':'application/json',
            },
            credentials:'include',
          }).then(async(response)=>{
            const res = await response.json();
            setSearchResults(res.data);
          })
        }

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
    }
   })
 }


  return (
    <div className="prIn-main">
      <div className="invite-grid">
        {invites.length > 0 ? invites.map((invite)=>(
        <div key={invite.id} className="inviteCard">
            <div>
            <p>{invite.project?.name}</p>
            <p>To: {invite.owner}</p>
            </div>
            <p>{invite.status}</p>
              {invite.status=="PENDING"? 
            <div>
              <button className="invite-action"  onClick={()=>{inviteAction('c',invite.id)}}>X</button>
            </div>:""}
          </div>  
        )) : <p>No invites yet</p>}
      </div>
      <div >
        <div className="createInvite">
        <h3>Invite to project:</h3>
        <div> <input type="text" className="search-inbox" placeholder="Send Invitation &#128269;" onChange={async(e)=>{
            searchHandler(e.target.value)
          }}/>
          {searchResults.length > 0 && 
          <div className="results-inbox">
        
            {searchResults.map((user)=>
              <div key={user.id} className="item-inbox">
                <p className="search-name">{user.username}</p>
                <p className="search-id">id: {user.id}</p>
                <div className="divider"></div>
                <button className="invite-button" onClick={() => addInvite(user)}>+</button>
                </div>)}

          </div>}

          </div>
          </div>
          
      </div>
       <div className="user-inbox">
              {sendInvite.length >0 && sendInvite.map((user)=>
                <div key={user.id} className="item-invite">
                  <p className="invite-name">{user.username}</p>
                  <p className="invite-id">id: {user.id}</p>
                  <div className="divider"></div>
                  <button className="invite-button" onClick={()=>{deleteInvite(user.id)}}>X</button>
                </div>)}
        </div>
        {sendInvite.length > 0 && <button className="send-invites" onClick={() => {
          fetch(`${API_URL}/api/account/sendInvites`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invites: sendInvite, projectId: id }),
          }).then(async (response) => {
            const res = await response.json();
            if (res.success) {
              setSendInvite([]);
            }
          });
        }}>Send Invites</button>}
    </div>
  )
}
