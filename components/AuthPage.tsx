import { useState } from "react";

export default function AuthPage() {

  const [way,setWay] = useState("");
   const currentWay = sessionStorage.getItem('auth') || "" ;
   
   if( !(way ===currentWay)){
   setWay(currentWay)
   }

   const [err,setErr] = useState("")

   const [username,setUsername] = useState("");
   const [password,setPassword] = useState("");
  
  const Validation = async(e: React.FormEvent<HTMLFormElement>)=>{
   e.preventDefault()

    if(!(username && password)){
      setErr("Username or password not specified")
    }else{
      if(username.length<3){
        setErr("Username has to be 3 characters or longer")
      }else{
        if(password.length<8){
          setErr("Password has to be 8 characters or longer")
        }else{
          setErr('')
          const data = {username,password}
        const res = await fetch('http://localhost:3000/api/' + way, {
          method:"POST",
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify(data)
        });
        const d = await res.json();
        
        if (!res.ok) {
          setErr(d.error);
          return;
        }
        
        await localStorage.setItem("token", d);

 

        }
      }
    }

  }

  return (
    <section>
      <h3>{way==="signup"?"Sign Up":"Login"}</h3>
      <p>{err}</p>
      <form onSubmit={Validation}>
        <input type="text" className="credentials"  
        onChange={(e)=>{setUsername(e.target.value)}}
        />

        <input type="text" className="credentials" 
         onChange={(e)=>{setPassword(e.target.value)}}
        />

        <button type="submit"></button>
      </form>

    </section>
  )
}
