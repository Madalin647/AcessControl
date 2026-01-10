"use client"

import { useState } from "react"

export default function Home() {

  const [data,setData] = useState('')


 const res  = async ()=>{
  await fetch("http://localhost:3000/api/account/dashBoardInfo", {
      method:'GET',
      headers:{
       'Content-Type':'application/json',
      },
      credentials:'include',
    }).then(async(response)=>{
      const res  = await response.json();
      setData(res.data.username)
    })


  }

  res()
  return (
    <>
    {data}
    </>
  )
}
