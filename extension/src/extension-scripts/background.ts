// Include the Socket.IO client script
// importScripts("libs/socket.io.js");
import { io } from "socket.io-client";
import { getCurrentTime } from "../helpers/utils";
import { BroadcastMessage, DataOperationsMessage, Errors, Home, LogEntry, Messages, Room, VideoDetails } from "../types/types";

var messages:Messages = [];
var errors:Errors = [];

var room:Room | undefined;

var home:Home = {
  highlighting: false,
};
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
  console.log('Connected to Socket.IO server');
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
  let m:DataOperationsMessage = {
    type: "DataOperations",
    action: "setRoom",
    data: data,
    from: "background",
    to: ["extension"]
  }
  chrome.runtime.sendMessage(m);
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
  if(message.type === "DataOperations"){
    let m:DataOperationsMessage = message;
    if (m.from == "extension") {
      switch (message.action) {
        case "createRoom":
          console.log("background.js received createRoom message:", message.data);
          socket.emit("createRoom", message.data.roomId, message.data.userId);
          break;
        case "joinRoom":
          console.log("background.js received joinRoom message:", message.data);
          socket.emit("joinRoom", message.data.roomId, message.data.userId);
          break;
        case "getMessages":
          // chrome.runtime.sendMessage({ type: "allMessages", data: messages });
          sendResponse(messages);
          break;
        case "getErrors":
          // chrome.runtime.sendMessage({ type: "allErrors", data: errors });
          sendResponse(errors);
          break;
        case "getRoom":
          // chrome.runtime.sendMessage({ type: "room", data: room });
          sendResponse(room);
          break;
        case "leaveRoom":
          socket.emit("leaveRoom", (response:boolean) => {
            console.log("background.js received leaveRoom message:", response);
            (response?room = undefined:null)
            sendResponse(response); //sends response to extension
          });
          return true; //as the response is delayed due to socket request
          break;
        default:
          console.log("Unknown action:", message.action);
          break;
      }
    }
    else if(m.from == "contentScripts"){
      switch (message.action) {
        case "setRoomVideoDetails":
          if (sender.tab && sender.tab.url && message.data && message.data.path) {
            const videoDetails: VideoDetails = {
              videoLink: sender.tab.url,
              videoElementJsPath: message.data.path,
            };
            console.log(videoDetails)
            if (room) {
              room.VideoDetails = videoDetails;
              socket.emit("shareVideoToRoom", room?.VideoDetails)
            }
          }else console.log("Invalid message or sender data")
          break;
      }
    }
  }
  

  else if(message.type === "BroadcastMessage"){
    console.log("background","broadcast")
    let m:BroadcastMessage = message;

    if(message.action === "setHighlighting"){
      home.highlighting = m.data.highlighting;
    }

    if (m.to.includes("contentScripts")) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id!, m);
        console.log("sending data to content.js", m)
      });
    }
  
    if (m.to.includes("extension")) {
      chrome.runtime.sendMessage(m);
      console.log("sending data to extension", m)
    }
    console.log()
  }

  else if (message.type === 'dataFetching') {
    if(message.action === 'getHomeData')
      sendResponse(home);
  }
  
  else if (message.type === 'log') {
    if(typeof(message.data) === 'object'){
      console.log(message.data)
    }
    let logMessage = `[${message.context}] ${message.data}`;
    
    if (sender.frameId) {
        logMessage += ` | Frame ID: ${sender.frameId}`;
    }

    if (sender.url) {
        logMessage += ` | URL: ${sender.url}`;
    }

    if (sender.origin) {
        logMessage += ` | Origin: ${sender.origin}`;
    }

    console.log(logMessage);
  }
  
});