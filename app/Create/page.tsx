"use client"
import { ThemeContext } from "@/components/ThemeContext";
import { useEffect, useState, useContext } from "react"
import "@/styles/newProject.css"
import Image from "next/image";

export default function Page() {

  const {theme} = useContext(ThemeContext) ?? { theme: 'light', toggleTheme: () => {} }

  const pic = theme === 'dark' ? "/arrow-white.svg" : '/arrow-black.svg';

  const [open, setOpen] = useState<number[]>([]);

  type taskType = {name:string,description:string}

 const [task, setTask] = useState<taskType[]>(() => {
    const tasksJson = sessionStorage.getItem("tasks")
    return JSON.parse(tasksJson || "[]") || [{name:"",description:""}]
  })


  useEffect(()=>{
    const interval = setInterval(() => {
    sessionStorage.setItem("tasks", JSON.stringify(task));
    
  }, 3000); 

  

  return () => clearInterval(interval);
  },[task]);

  

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


  return (
    <div className="body">
      <section className="build-body">

        <div className="build-header">
        <div className="content">
        <div className="build-section title">
          <p>Title:</p>
          <input name="Title" className="title-area"/>
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
                        const nextIndex = index + 1;
                        setOpen(open.filter(i => i !== nextIndex));
                      }else{
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
          <input type="text" placeholder="Send Invitation"/>
        </div>
        </div>
        </div>

        <div className="submit-project">
          <button className="button">Create Project</button>
        </div>

      </section>

      <p>*After you create a new project, you can add or modify the tasks and their decription.</p>
    </div>
  )
}
