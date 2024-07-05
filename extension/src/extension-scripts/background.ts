// Include the Socket.IO client script
// importScripts("libs/socket.io.js");
import { io } from "socket.io-client";
import {Error, Errors, Message, Messages } from "../types/all";
import { getCurrentTime } from "../helpers/utils";

var messages:Messages = [];
var errors:Errors = [];


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

// Add more event listeners as needed
socket.on('message', (data) => {
  console.log('Received message from server:', data);
  let message:Message = {data:data, time: getCurrentTime()}
  chrome.runtime.sendMessage({ type: 'message', data: message });
  messages = [ ...messages, message]
});

// Add more event listeners as needed
socket.on('error', (data) => {
  console.log('Received error from server:', data);
  let error:Error = {data:data, time: getCurrentTime()}
  chrome.runtime.sendMessage({ type: 'error', data: error });
  errors = [ ...errors, error]
});

// You can also define functions to emit events from other parts of your extension
// function emitTestEvent(data) {
//   socket.emit('testing', data, (response) => {
//     console.log('Response from server:', response);
//   });
// }

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === "createRoom") {
    console.log("background.js received createRoom message:", message.data);
    socket.emit('createRoom', message.data.roomId, message.data.userId);
  }
  if (message.type === "joinRoom") {
    console.log("background.js received joinRoom message:", message.data);
    socket.emit('joinRoom', message.data.roomId, message.data.userId);
  }
  if(message.type === "getMessages"){
    chrome.runtime.sendMessage({ type: 'allMessages', data: messages });
  }
  if(message.type === "getErrors"){
    chrome.runtime.sendMessage({ type: 'allErrors', data: errors });
  }
});