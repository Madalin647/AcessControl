"use client"

import "@/styles/projects.css"
import { useEffect, useState } from "react";
import Select, { CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function Projects() {

  const route = useRouter();

  type project={
      id:number,
      name:string,
      owner:{id:number, username:string} ,
      members:[{username:string, pids:[number]}],
      timestamp:Date | string | null,
  }

  const [projects, setProjects] = useState<project[]>([])
  const [id,setId]= useState()

  useEffect(()=>{
    fetch(`${API}/api/account/projects`,{
      method:"GET",
      headers:{
         'Content-Type':'application/json',
     }
    }).then(async(response)=>{
      const r = await response.json();
      setProjects(r.data)
      setId(r.id)
    })
  },[])


  useEffect(()=>{
    

    const interval = setInterval(()=>{
      fetch(`${API}/api/account/projects`,{
      method:"GET",
      headers:{
         'Content-Type':'application/json',
     }
    }).then(async(response)=>{
      const r = await response.json();
      setProjects(r.data)
    })
    },3000)

    return ()=>clearInterval(interval)
  })

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
    {value:"1" , label:"All Projects"},
    {value:"2" , label:"My Projects"},
    {value:"3" , label:"Invited on"}
  ]
 
  const [value, setValue] = useState("1")

  return (<>
    {projects  ?   <section className="projects">
      
    <div className="option-section">
      <p>Sort By:</p>
    <Select 
    value={options.find(opt => opt.value === value) || options[0]}
    options={options}
    onChange={(e)=>{setValue(e?.value || '1')}}
    styles={customStyles}
    />
    </div>
    <div className="projects-list">
     {projects.map((p)=>{

      const date = p.timestamp ? new Date(p.timestamp) : new Date();
      const formatted = new Intl.DateTimeFormat('en-GB').format(date);

      const element = <div key={p.id} className="pr">
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

      let status = "1"

      if(value != status){
        status = value
      }

      if(status == "1"){

      return(
        element
      )
    }
    if(status == "2"){
      if(id == p.owner.id){
         return(
        element
      )
      }
    }

    if(status == "3"){
      if(id != p.owner.id){
         return(
        element
      )
      }
    }

     })}
    </div>
    </section> :  <section className="projects"><p>No projects here</p></section>}
    </>
  )
}
