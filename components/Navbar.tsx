import ThemeButton from "./ThemeButton"
import "@/styles/navbar.css"
import AuthPath from "./AuthPath"

export default function Navbar() {


  return (
    <div className="nav-body">
      <h2 className="nav-header">Acess Control</h2>
     
      <div className="spacer"></div>

     <AuthPath/>

      <ThemeButton/>
    </div>
  )
}
