import { useEffect, useState } from "react"
import { Errors, Messages } from "../../types/all";



const Footer = () => {
  const [messages, setMessages] = useState<Messages>([])
  const [errors, setErrors] = useState<Errors>([])

  useEffect(() => {
    chrome.runtime.sendMessage({type:"getMessages"})
    chrome.runtime.sendMessage({type:"getErrors"})
  } , [])

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "message") {
      setMessages([message.data, ...messages ])
    } else if (message.type === "error") {
      setErrors([message.data, ...errors ])
    }else if(message.type==="allMessages"){
      console.log(message.data)
      setMessages(message.data)
    }else if(message.type==="allErrors"){
      setErrors(message.data)
    }
  });
  

  return (
    <div className="border-t-2">
      Messages:
      <div id="messages" className="flex flex-col border h-10 overflow-auto">
        {messages.map((message, index) => (
          <div key={index}><span>{message.time}</span> <span>{message.data}</span></div>
        ))}
      </div>
      Errors:
      <div id="errors" className="flex flex-col border h-10 overflow-auto">
        {errors.map((error, index) => (
          <div key={index}><span>{error.time}</span> <span>{error.data}</span></div>
        ))}
      </div>
    </div>
  )
}

export default Footer