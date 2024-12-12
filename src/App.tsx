import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([["Credit @import-hardik","86:56 am","editor"]]);
  const wsRef = useRef();
  const inputRef = useRef<HTMLInputElement | null>(null);
  let where="flex w-full mt-2 space-x-3 max-w-xs"

  useEffect(() => {
    const ws = new WebSocket("https://3216153f-5c1a-4c1f-9bef-5af34de29250-00-10grjulav6pj4.sisko.replit.dev/");
    ws.onmessage = (event) => {
      setMessages(m => [...m, [JSON.parse(event.data).payload.message,JSON.parse(event.data).payload.time,JSON.parse(event.data).payload.browserID]])
    }
    // @ts-ignore
    wsRef.current = ws;
    // name gernate
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let name = '';
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      name += chars[randomIndex];
    }
    // name gernate
    sessionStorage.setItem('name', name);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }
    return () => {
      ws.close()
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-gray-100 text-gray-800 p-10">
      	<div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="flex flex-col flex-grow h-0 p-4 overflow-auto">

        {messages.map(message => 
          <div className={(message[2])==sessionStorage.getItem('name')?"flex w-full mt-2 space-x-3 max-w-xs":"flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end"}>
          {/* <div className="flex-shrink-0 h-10 w-10 "></div> */}
          <div>
            <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
              <p className="text-sm">{(message[0])} </p>
            </div>
            <span className="text-xs text-gray-500 leading-none">{(message[1])}</span>
            <span className="text-xs text-gray-500 leading-none">{"  "+(message[2])}</span>
          </div>
        </div>
      )}
      </div>
      </div>
      <div className='w-full bg-white flex'>
        // @ts-ignore
        <input ref={inputRef} id="message" className="flex-1 p-4"></input>
        <button onClick={() => {
          const message = inputRef.current?.value;
          // @ts-ignore
          document.getElementById("message").value="";
          // time const start
          const now = new Date();
          let hours = now.getHours();
          const minutes = now.getMinutes();
          const ampm = hours >= 12 ? 'PM' : 'AM';
          hours = hours % 12 || 12;
          // time const end
        // @ts-ignore
          wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
              message: message,
              time:`${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`,
              browserID:sessionStorage.getItem('name'),
            }
          }))

        }} className='bg-purple-600 text-white p-4'>
          Send
        </button>
      </div>
    </div>
  )
}

export default App
