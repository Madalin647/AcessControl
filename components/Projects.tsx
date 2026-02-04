"use client"

import "@/styles/projects.css"
import { useEffect, useState } from "react";
import Select, { CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export default function Projects() {


  useEffect(()=>{
    fetch(`${API}/api/account/projects`,{
      method:"GET",
      headers:{
         'Content-Type':'application/json',
     }
    }).then(async(response)=>{
      const r = await response.json();
      console.log(r.data)
    })

    const interval = setInterval(()=>{
      fetch(`${API}/api/account/projects`,{
      method:"GET",
      headers:{
         'Content-Type':'application/json',
     }
    }).then(async(response)=>{
      const r = await response.json();
      console.log(r.data)
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
    {value:"PENDING" , label:"My Projects"},
    {value:"3" , label:"Invited on"}
  ]
 
  const [value, setValue] = useState("All Projects")

  return (
    <section className="projects">
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
     <div className="pr"></div>
     <div className="pr"></div>
     <div className="pr"></div>
     <div className="pr"></div>
    </div>
    </section>
  )
}
