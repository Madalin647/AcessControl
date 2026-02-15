import { useEffect,useState, useContext } from "react"
import { useParams } from "next/navigation";
import { ThemeContext } from "./ThemeContext";
import Image from "next/image";
import Select, {CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";
import "@/styles/project.css"

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"

export default function Tasks() {

  const {theme} = useContext(ThemeContext) ?? { theme: 'light', toggleTheme: () => {} }

  const pic = theme === 'dark' ? "/arrow-white.svg" : '/arrow-black.svg';

  type Task ={
  content: string,
  createdAt: string,
  id: number,
  pid: number,
  status: "TODO" | "COMPLETED" | "WORKING",
  title: string,
  uid: number,
  updatedAt: string,
  }

  const [tasks,setTasks] = useState<Task[]>()


   const params = useParams();
   const id = params.id;

   useEffect(()=>{
    fetch(`${API_URL}/api/account/tasks?query=${id}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
      }
    }).then(async(res)=>{
      const r = await res.json();

      const d =r.data.map((e: Task)=>{
        const date = new Date(e.createdAt);
        const date2 = new Date(e.updatedAt);

        const created = new Intl.DateTimeFormat('en-GB').format(date);
        const updated = new Intl.DateTimeFormat('en-GB').format(date2);

        e.createdAt = created;
        e.updatedAt= updated;

        return e

      })

      setTasks(d);
    })
   },[id])

   useEffect(()=>{
    const interval = setInterval(()=>{
      fetch(`${API_URL}/api/account/tasks?query=${id}`,{
      method:'GET',
      headers:{
        'Content-Type':'application/json',
      }
    }).then(async(res)=>{
      const r = await res.json();

      const q = r.data;

      const d =q.map((e: Task)=>{
        const date = new Date(e.createdAt);
        const date2 = new Date(e.updatedAt);

        const created = new Intl.DateTimeFormat('en-GB').format(date);
        const updated = new Intl.DateTimeFormat('en-GB').format(date2);

        e.createdAt = created;
        e.updatedAt= updated;

        return e

      })
      setTasks(d);
    
    })
    },3000)

    return ()=>{clearInterval(interval)}
   })


   const [open, setOpen] = useState<number[]>([])

   const customStyles = {
       control: (base: CSSObjectWithLabel, state: ControlProps<{ value: string; label: string }, false, GroupBase<{ value: string; label: string }>>) => ({
         ...base,
         backgroundColor: 'transparent',
         border:'none',
         borderColor: state.isFocused ? '#ffffff00' : '#ffffff00',
         borderWidth: state.isFocused ? '2px' : '1px',
         boxShadow: state.isFocused ? '0 0 0 1px #ffffff00' : 'none',
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
       {value:"TODO" , label:"TODO"},
       {value:"WORKING" , label:"WORKING"},
       {value:"COMPLETED" , label:"COMPLETED"}
     ]

  return (
    <div className="task-contain">
      {tasks && tasks[0]  ? <>{tasks.map((e)=>{

        const isOpen = open.includes(e.id);
          let color;
        if(e.status === "TODO"){
          color = "red";
        }else if(e.status === "WORKING"){
          color = "yellow";
        }else{
          color = "green"
        }
      

        return(
          <div className="task-body" key={e.id}>
            <div className="task-base">
            <p className="task-title">{e.title}</p>
            <p>From: {e.createdAt}</p>
          {e.content ?  <button className="task-more"><Image alt="arrow" width={20} height={20} src={pic} onClick={()=>{
              if(isOpen){
                setOpen(open.filter(i => i !== e.id))
              }else{
                setOpen([...open, e.id])
              }
            }}/></button> : <div className="spacing"></div>}
            <div className="task-status">
              <div className="status-container">
            <p>Status:</p>  
            <Select 
              value={options.find(opt => opt.value === e.status) }
              options={options}
               onChange={(f)=>{ if (f?.value) { 

                fetch(`${API_URL}/api/account/tasks?query=${e.id}`,{
                  method:'POST',
                  headers:{
                    'Content-Type':'application/json',
                  
                  },
                  body:JSON.stringify({value:f.value})
                })

                 const updatedTasks = tasks.map(task => 
                   task.id === e.id 
                    ? { ...task, status: f.value as "TODO" | "WORKING" | "COMPLETED" }
                     : task
                    );
                 setTasks(updatedTasks);
                }
               }}
                styles={customStyles}
             /> </div>
            <div className="status-color" style={{backgroundColor:color}}></div>
            </div>
            </div>
          {isOpen && e.content ?  <div className="task-description">
              <p>Description:</p>
              <p className="task-d-content">{e.content}</p>
            </div> : ''}
          </div>
        )
      })}</>
      : 
      ''}
    </div>
  )
}
