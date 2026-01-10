"use client"
import { useContext } from "react"
import { ThemeContext } from "./ThemeContext"
import Image from "next/image"

export default function ThemeButton() {
  const ctx = useContext(ThemeContext)
  if (!ctx) return null

  const {theme,toggleTheme } = ctx

  return (
    <button onClick={toggleTheme} aria-label="Toggle theme"  className="button">
   <Image src={theme==='light'?"/sun.svg":"/moon.svg"} alt={theme==='light'?"light":"dark"} height={28} width={28}  className="theme-image" />
    </button>
  )
}
//