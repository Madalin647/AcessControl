import React from 'react'
import { Metadata } from 'next'

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"

  type Props={
    params:Promise<{id:string}>;
  }


  export async function generateMetadata({params}:Props): Promise<Metadata> {
    const {id} =await params;

    const post = await fetch(`${API_URL}/api/project?query=${id}`).then(async(res)=>{
      const r =await res.json()
      return r.data
    })
    
     return {
    title: `${post}`,
    description: `Details for project ${post}`,
  };
  }

export default function RootLayout({children}:
  Readonly<{children:React.ReactNode}>
) {
  return (
    [children]
  )
}
