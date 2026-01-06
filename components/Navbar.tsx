import ThemeButton from "./ThemeButton"
import "@/styles/navbar.css"
import Link from "next/link"
import AuthPath from "./AuthPath"

export default function Navbar() {
  return (
    <div className="nav-body">
      <Link href={'/'} className="nav-header">Acess Control</Link>
     
      <div className="spacer"></div>

     <AuthPath/>

      <ThemeButton/>
    </div>
  )
}
