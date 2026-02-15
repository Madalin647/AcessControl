import { useEffect,useState } from "react"
import { useParams } from "next/navigation";
import "@/styles/project.css"

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"

export default function ProjectInfo() {

  type Info ={
    id:number,
    members:Array<string>,
    admin:string,
    name:string,
    createdAt: string | null,
    lastUpdate: string | null,
  }

  const [data,setData] = useState<Info>()

   const params = useParams();
   const id = params.id;

  useEffect(()=>{
    fetch(`${API_URL}/api/account/getInfo?query=${id}`,{
      method:"GET",
      headers:{
        'Content-Type':'application/json',
      }
    }).then(async(response)=>{
      const r = await response.json()

      const res  = r.data

      const date = new Date(res.createdAt);
      const formatted = new Intl.DateTimeFormat('en-GB').format(date);

      const update = new Date(res.lastUpdate)
      const formatted2 = new Intl.DateTimeFormat('en-GB').format(update);

      res.createdAt = formatted;
      res.lastUpdate = formatted2;
      
      console.log(res)

      setData(res)
    })
  },[id])

  return (
   <section className="side-content">
   <p>Name: {data?.name} </p>
   <p>Owner: {data?.admin}</p>
   <p>Created at {data?.createdAt}</p>
   {data?.lastUpdate ? <p>Last updated at {data?.lastUpdate}</p> : '' }
   {data?.members[0]  ? <div className="members-section"><p>Members: </p> <div className="members-names">{data?.members.map((e)=>{return(<p key={e}>{e}</p>)})} </div></div> : ''}
   </section>
  )
}
