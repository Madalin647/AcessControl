import "@/styles/messageBox.css"
import { ThemeContext } from "./ThemeContext"
import { useContext,useEffect,useState,useRef } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000"

export default function MessageBox() {

   const params = useParams();
   const id = params.id;

    const {theme} = useContext(ThemeContext) as {theme:string}
  
    const pic = theme == 'light' ? '/back-black.svg' : '/back-white.svg'

    type Message = {
      content:string,
      name:string,
      id:number,
      sId:number
    }

     const [userId, setUserId] = useState<number | null>(null)

     const [messagesOld, setMessagesOld] = useState<Message[]>([])

    const [messages, setMessages] = useState<Message[]>([])
  
    const [message, setMessage] = useState("")

    useEffect(()=>{
      fetch(`${API_URL}/api/account/messages?query=${id}`,{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
        }
    })
      .then(async(response)=>{
        const r = await response.json()
        setMessages(r.messages)
        setMessagesOld(r.messages)
        setUserId(r.userId)
      })
  },[id])

  useEffect(()=>{
    const interval = setInterval(()=>{
       fetch(`${API_URL}/api/account/messages?query=${id}`,{
        method:"GET",
        headers:{
          'Content-Type':'application/json',
        }
    })
      .then(async(response)=>{
        const r = await response.json()
        if(JSON.stringify(r.messages) !== JSON.stringify(messagesOld)){
          setMessagesOld(r.messages)
          setMessages(r.messages)
        }
      })
    },1000)

    return ()=> clearInterval(interval)
  })

  const sendMessage = ()=>{
    const data = {pId:id, message}
    fetch(`${API_URL}/api/account/message`,{
      method:"POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
  }

  function useAutoScroll(dependency: unknown) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);

  const handleScroll = () => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 10; 
    wasAtBottomRef.current =
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold;
  };


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (wasAtBottomRef.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [dependency]);

  return { containerRef, handleScroll };
}

 const { containerRef, handleScroll } = useAutoScroll(messages);

  return (
    <section className="message-main">
      <div className="shade m-container"></div>
      <div className="m-container messages"
      ref={containerRef}
      onScroll={handleScroll}>
        {messages.map((msg,index)=>(
          <div key={index}  className={`chat-message ${msg.sId == userId ? 'own' : ''}`}>
            <p className="chat-m-name">{msg.name}</p>
            <p className="chat-m-content">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="m-container message-input">
        <div className="message-send">
          <input type="text" className="message-send-input" placeholder="Type a message"
           value={message} onChange={(e) => setMessage(e.target.value)} />
          <button className="message-send-button" onClick={()=>{sendMessage(); setMessage("")}}><Image src={pic} alt="Send" width={20} height={20} /></button>
          </div>
      </div>
    </section>
  )
}
