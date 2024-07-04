import { useState } from "react"

//create a type for the message

type Message = {
  time: string;
  data: string;
}

type Error = {
  time: string;
  data: string;
}

type Messages = Message[];

type Errors = Error[];

function getCurrentTime() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

const Footer = () => {
  const [messages, setMessages] = useState<Messages>([])
  const [errors, setErrors] = useState<Errors>([])

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "message") {
      setMessages([{data:message.data, time: getCurrentTime()}, ...messages, ])
    } else if (message.type === "error") {
      setErrors([{data:message.data, time: getCurrentTime()}, ...errors, ])
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