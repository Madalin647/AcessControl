"use client"
import { ThemeContext } from "@/components/ThemeContext";
import { useEffect, useState, useContext } from "react"
import "@/styles/newProject.css"
import Image from "next/image";
import { useRouter } from "next/navigation"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


export default function Page() {

  
    const router = useRouter();

  useEffect(()=>{
     fetch(`${API_URL}/api/account/loggedIn`,{
         method:'GET',
        headers:{
         'Content-Type':'application/json',
        },
        credentials:'include',
      }).then(async(response)=>{
        const res = await response.json();
        if(res.data !== 1){
          router.push('/Dashboard')
        }
      })
  
    },[router])

const [title, setTitle] = useState<string>(() => {
    let titleJson: string | null = null;
    if (typeof window !== "undefined") {
      titleJson = sessionStorage.getItem("title");
    }
    return JSON.parse(titleJson ?? '""') || "";
  });

  const [invites, setInvites] = useState<{id:string, username:string}[]>([]);

  const [searchResults, setSearchResults] = useState<{id:string, username:string}[]>([]);


  async function searchHandler(value:string){
    await fetch(`${API_URL}/api/account/search?query=${value}`, {
      method: 'GET',
      headers:{
       'Content-Type':'application/json',
      },
      credentials:'include',
    }).then(async(response)=>{
      const res = await response.json();
      setSearchResults(res.data);
    })
  }

  const {theme} = useContext(ThemeContext) ?? { theme: 'light', toggleTheme: () => {} }

  const pic = theme === 'dark' ? "/arrow-white.svg" : '/arrow-black.svg';

  const [open, setOpen] = useState<number[]>([]);

  type taskType = {name:string,description:string}

  const [task, setTask] = useState<taskType[]>(() => {
    let tasksJson: string | null = null;
    if (typeof window !== "undefined") {
      tasksJson = sessionStorage.getItem("tasks");
    }
    return JSON.parse(tasksJson ?? "[]") || [{ name: "", description: "" }];
  });


  useEffect(()=>{
    const interval = setInterval(() => {
    sessionStorage.setItem("tasks", JSON.stringify(task));
    sessionStorage.setItem("title", JSON.stringify(title));
  }, 3000); 

  

  return () => clearInterval(interval);
  },[task,title]);

  

  useEffect(() => {

    let textarea = document.querySelector('.t-description') as HTMLTextAreaElement;
    setInterval(() => {
    textarea = document.querySelector('.t-description') as HTMLTextAreaElement;
    if (textarea) {
      textarea.addEventListener('input', handleInput);
    }
    }, 4000);

  const handleInput = ()=>{
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = textarea?.scrollHeight + 'px';
  };


  

  
  return () => {
    if (textarea) {
      textarea.removeEventListener('input', handleInput);
    }
  };
}, []);

  function addInvite(user:{id:string, username:string}){
    if(!invites.find(u=>u.id === user.id)){
      setInvites([...invites, user]);
    }
  }

  function deleteInvite(id:string){
    setInvites(invites.filter(u=>u.id !== id));
  }

  async function makeProject(){

    if (task.map(t => t.name).includes("")) {
      alert("Please make sure all tasks have a name.");
      return;
    }


    await fetch(`${API_URL}/api/account/create`, {
      method: 'POST',
      headers:{
        'Content-Type':'application/json',
      },
      credentials:'include',
      body: JSON.stringify({
        title,
        invites,
        tasks: task
      })
    }).then(async(response)=>{
      sessionStorage.removeItem("tasks");
      sessionStorage.removeItem("title");
      const res = await response.json();
      if(res.data ===1){
        router.push('/Dashboard');
      }
    })
  }

  return (
    <div className="body">
      <section className="build-body">

        <div className="build-header">
        <div className="content">
        <div className="build-section title">
          <p>Title:</p>
          <input value={title} name="Title" className="title-area" onChange={(e)=>{setTitle(e.target.value)}}/>
        </div>

        <div className=" task">
        <button className="add-task" onClick={()=>{setTask([...task, {name:"",description:""}]);}}>Task +</button>
        
        <div className="task-container">
          {task.map((value:taskType,index:number)=>{

            const isOpen = open.includes(index);

            return(
              <div key={index} className="task-item">
                <p className="t-numerotation">Task {index+1}:</p>
                <div className="task-inputs">
                  <div className="task-main">
                    <input className="task-title" type="text" value={value.name} placeholder="Task Name" onChange={(e)=>{
                      const newTasks = [...task];
                      newTasks[index] = {...newTasks[index], name: e.target.value};
                      setTask(newTasks);
                    }}/>
                    <button className="pop-button" onClick={()=>{
                      if(isOpen){
                        setOpen(open.filter(i => i !== index));
                      } else {
                        setOpen([...open, index]);
                      }
                    }}><Image src={pic} alt="arrow" width={20} height={20}/></button>
                    <button className="d-button" onClick={()=>{
                      setTask(task.filter((_, i) => i !== index));
                      if(isOpen){
                        setOpen(open.filter(i => i !== index));
                      } else {
                        setOpen(open.map(i=>index<i ? i-1 : i));
                      }
                    }}>Delete</button>
                </div>
                {isOpen && <div className="pop-content">

                  <div className="bracket"></div>

                  <textarea className="t-description" value={value.description} placeholder="Task Description" onChange={(e)=>{
                  const newTasks = [...task];
                  newTasks[index] = {...newTasks[index], description: e.target.value};
                  setTask(newTasks);
                }}/>
                </div>}
                </div>
              </div>
            )
          })}
        </div>

        </div>
        </div>

        <div className="search-section">
        <div className="build-section search">
          <input type="text" className="search-invite" placeholder="Send Invitation &#128269;" onChange={async(e)=>{
            searchHandler(e.target.value)
          }}/>
          {searchResults.length > 0 && 
          <div className="search-results">
        
            {searchResults.map((user)=>
              <div key={user.id} className="search-item">
                <p className="search-name">{user.username}</p>
                <p className="search-id">id: {user.id}</p>
                <div className="divider"></div>
                <button className="invite-button" onClick={() => addInvite(user)}>+</button>
                </div>)}

          </div>}
        </div>
        <div className="user-invites">
              {invites.length >0 && invites.map((user)=>
                <div key={user.id} className="invite-item">
                  <p className="invite-name">{user.username}</p>
                  <p className="invite-id">id: {user.id}</p>
                  <div className="divider"></div>
                  <button className="invite-button" onClick={()=>{deleteInvite(user.id)}}>X</button>
                </div>)}
        </div>
        </div>
        </div>

        <div className="submit-project">
          {title ? <button onClick={makeProject} className="button">Create Project</button>:<p>Create Project</p>}
        </div>

      </section>

      <p>*After you create a new project, you can add or modify the tasks and their decription.</p>
    </div>
  )
}
