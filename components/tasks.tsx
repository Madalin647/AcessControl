import { useEffect,useState, useContext } from "react"
import { useParams } from "next/navigation";
import { ThemeContext } from "./ThemeContext";
import Image from "next/image";
import Select, {CSSObjectWithLabel, ControlProps, OptionProps, GroupBase } from "react-select";
import "@/styles/project.css"

 const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"

export default function Tasks() {

    useEffect(() => {

    let textarea = document.querySelector('.t-des') as HTMLTextAreaElement;
    setInterval(() => {
    textarea = document.querySelector('.t-des') as HTMLTextAreaElement;
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

  const {theme} = useContext(ThemeContext) ?? { theme: 'light', toggleTheme: () => {} }

  const pic = theme === 'dark' ? "/arrow-white.svg" : '/arrow-black.svg';

  const del = theme === 'dark' ? "/delete-white.svg" : '/delete-black.svg';

  const back = theme === 'dark' ? "/replay-white.svg" : '/replay-black.svg';

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

     const [ownerShip,setOwnerShip] = useState<number>(0)
   
     useEffect(()=>{
       fetch(`${API_URL}/api/account/status?query=${id}`,{
         method:"GET",
         headers:{
           'Content-Type':'application/json',
         }
       }).then(async(response)=>{
         const r = await response.json()
         console.log(r.data)
         setOwnerShip(r.data)
       })
     },[id])

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

     const [creation,setCreation] = useState<boolean>(false)
     const [creationOpen,setCreationOpen] = useState<boolean>(false)

     const [deletion,setDeletion] = useState<boolean>(false)

     const [title, setTitle] = useState<string>("")
     const [description, setDescription] = useState<string>("")

          const [delList, setDelList] = useState<number[]>([])


   const handleDeletion = function(){
      fetch(`${API_URL}/api/account/tdelete`,{
        method:'POST',
        headers:{
          'Content-Type':'application/json',},
          body:JSON.stringify({ids:delList})
     })}

     const delElement = deletion ? <div className="deletion-section">
      <button className="task-delete-btn" onClick={()=>{handleDeletion(); setDeletion(false)}} ><Image src={del} alt="delete" width={20} height={20}/></button> 
     <button className="back-d-button" onClick={()=>{setDeletion(!deletion); setDelList([])}}><Image src={back} alt="back" width={20} height={20}/></button>
     </div> : <button className="task-delete-btn" onClick={()=>{setDeletion(!deletion)}}><Image src={del} alt="delete" width={20} height={20}/></button> 


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

        let dColor;

        if(delList.includes(e.id)){
          dColor = "red"
        }
        else{
          dColor = "var(--foreground)"
        }
      

        return(
          <div className="task-body" key={e.id} style={{border:`2px solid ${deletion ? "transparent":"var(--foreground)"}`}}>
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
          {isOpen && e.content != "" ?  <div className="task-description">
              <p>Description:</p>
              <p className="task-d-content">{e.content}</p>
            </div> : ''}
           <button className="del-selector" style={{border:`2px solid ${dColor}`, display: deletion ? "block" : "none"}} onClick={()=>{
            if(delList.includes(e.id)){
              setDelList(delList.filter(i => i !== e.id))
            }else{
              setDelList([...delList, e.id])
            }
           }}><Image src={del} alt="delete" width={20} height={20}/></button>
          </div>
        )
      })}</>
      : 
      ''}
       {ownerShip ? <div className="task-update">
       {creation ? 
       <div className="task-body"> <div className="task-base t-create-height">
        <input placeholder="Title" value={title} onChange={(e)=>setTitle(e.target.value)} className="t-input" id="title"/>
        <button className="task-more" onClick={()=>{setCreationOpen(!creationOpen)}}><Image src={pic} alt="arrow" width={20} height={20}/></button>
        <button className="D-button" onClick={()=>{setCreation(!creation)}}>Delete</button>
        {title && <button className="D-button" 
        onClick={()=>{
          const body = {title,description:description || " ",pid:id}
          fetch(`${API_URL}/api/account/add`,{
            method:'POST',
            headers:{
              'Content-Type':'application/json',
            },
            body:JSON.stringify(body)
          })
          setCreation(false)
          setTitle("")
          setDescription("")
        }}>Send</button>}
        </div>
        {creationOpen && <div className="task-description">
          <textarea value={description} className="t-des" placeholder="Description" onChange={(e)=>setDescription(e.target.value)}></textarea>
          </div>}
        </div> 
        : <button className="task-update-btn" onClick={()=>{setCreation(!creation)}}>+</button> }
       {tasks && tasks.length > 0 ? delElement : ''}
        </div> : ''}
    </div>
  )
}
