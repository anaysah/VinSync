// Include the Socket.IO client script
// importScripts("libs/socket.io.js");
import { io } from "socket.io-client";
import { getCurrentTime } from "../helpers/utils";
import { Errors, LogEntry, Messages, Room } from "../types/types";

var messages:Messages = [];
var errors:Errors = [];

var room:Room | undefined;
// room = {
//   name: "any name", // this name is also same to roomId
//   members: {
//     sockedId:{name:"any name"}, //name is same as userId
//     '--djdhajad':{name:"any name"}, //name is same as userId
//     'ddkadajdjd':{name:"any name"}
//   } //members list
// }


// Connect to the Socket.IO server
const socket = io("http://localhost:3000", {
  // reconnection: true,
  // reconnectionDelayMax: 10000,
  // reconnectionDelay: 5000,
  // reconnectionAttempts: 5,
  transports: ['websocket'],
});


// Event listeners
socket.on('connect', () => {
  chrome.runtime.sendMessage({ type: 'message', data: "Connected to Socket.IO server" });
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

const addDataIntoLog = (type:"error" | "message", data:string) =>{
  console.log('Received message from server:', data);
  let log:LogEntry = {data:data, time: getCurrentTime()}
  chrome.runtime.sendMessage({ type: type, data: log });
  if(type === "message")
  messages = [ ...messages, log]
  else
  errors = [ ...errors, log]
}

// Add more event listeners as needed
socket.on('message', (data:string) => {
  addDataIntoLog("message", data);
});

// Add more event listeners as needed
socket.on('error', (data:string) => {
  addDataIntoLog("error", data);
});

socket.on("roomData", (data:Room)=>{
  room = data;
  chrome.runtime.sendMessage({ type: 'room', data: data });
})

// socket.on("newMember", (data:User)=>{
//   room.members = { ...room.members, [data.socketId!]:{name:data.name}}
// })

// socket.on("joinRoom", (data:Room)=>{
//   room = data;
// })

// You can also define functions to emit events from other parts of your extension
// function emitTestEvent(data) {
//   socket.emit('testing', data, (response) => {
//     console.log('Response from server:', response);
//   });
// }



chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "createRoom") {
    console.log("background.js received createRoom message:", message.data);
    socket.emit('createRoom', message.data.roomId, message.data.userId)
  }

  else if (message.type === "joinRoom") {
    console.log("background.js received joinRoom message:", message.data);
    socket.emit('joinRoom', message.data.roomId, message.data.userId);
  }
  
  else if(message.type === "getMessages"){
    chrome.runtime.sendMessage({ type: 'allMessages', data: messages });
  }

  else if(message.type === "getErrors"){
    chrome.runtime.sendMessage({ type: 'allErrors', data: errors });
  }
  
  else if(message.type === "getRoom"){
    chrome.runtime.sendMessage({ type: 'room', data: room });
  }

  else if(message.type == "leaveRoom"){
    socket.emit('leaveRoom');
    room = undefined;
  }

  else if(message.type === "log"){
    console.log("log: ", message.data);
  }

  else if(message.type === "broadcastToContentScripts"){
    //send message to current tab
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, message);
    });
  }
});