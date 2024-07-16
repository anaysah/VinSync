import { useEffect, useState } from "react"
import { DataOperationsMessage, Errors, LogEntry, Messages } from "../../types/types"



const Footer = () => {
  const [messages, setMessages] = useState<Messages>([])
  const [errors, setErrors] = useState<Errors>([])

  useEffect(() => {
    let m:DataOperationsMessage = {
      type:"DataOperations",
      action:"getMessages",
      from:"extension",
      to:["background"]
    }
    chrome.runtime.sendMessage(m, setMessages) //will get the data from background and set it
    
    m.action="getErrors"
    chrome.runtime.sendMessage(m, setErrors) //will get the errors from background
  } , [])

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "message") {
      setMessages([message.data, ...messages ])
    } else if (message.type === "error") {
      setErrors([message.data, ...errors ])
    }
  });
  

  return (
    <div className="border-t-2">
      Messages:
      <div id="messages" className="flex flex-col border h-10 overflow-auto">
        {messages.map((message: LogEntry, index: number) => (
          <div key={index}><span>{message.time}</span> <span>{message.data}</span></div>
        ))}
      </div>
      Errors:
      <div id="errors" className="flex flex-col border h-10 overflow-auto">
        {errors.map((error: LogEntry, index: number) => (
          <div key={index}><span>{error.time}</span> <span>{error.data}</span></div>
        ))}
      </div>
    </div>
  )
}

export default Footer