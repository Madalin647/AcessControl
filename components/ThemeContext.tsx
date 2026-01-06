"use client"

import { createContext, useState,useEffect } from "react";
import { PropsWithChildren } from "react";

interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({children}: PropsWithChildren){
  const [theme,setTheme]= useState("light");

  //get the last set theme from localStorage and apply it
  useEffect(()=>{
    const currentTheme = localStorage.getItem('theme') || "light"

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(currentTheme);
   document.documentElement.setAttribute('theme',currentTheme)

  },[])

  //Change the value of the current theme and apply it for change
  const toggleTheme = ()=>{
    const newTheme = theme=="light"? "dark":"light"

   setTheme(newTheme)

   document.documentElement.setAttribute('theme',newTheme)

  localStorage.setItem('theme',newTheme)

  }


  return(
    <ThemeContext.Provider value={{theme, toggleTheme}}>
    {children}
    </ThemeContext.Provider>
  )
}
