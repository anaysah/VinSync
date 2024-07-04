// Include the Socket.IO client script
importScripts("libs/socket.io.js");
// importScripts('https://cdn.socket.io/4.0.0/socket.io.min.js');

// Connect to the Socket.IO server
const socket = io("http://localhost:3000", {
  // reconnection: true,
  // reconnectionDelayMax: 10000,
  // reconnectionDelay: 5000,
  // reconnectionAttempts: 5,
  transports: ['websocket'],
});

// const socket = io("http://localhost:3000")

// Event listeners
socket.on('connect', () => {
  console.log('Connected to Socket.IO server');

  // Emit a test event when connected
  // socket.emit('testing', "sotnhing");
  // emitTestEvent("testing");
});

socket.on('disconnect', () => {
  console.log('Disconnected from Socket.IO server');
});

// Add more event listeners as needed
socket.on('message', (data) => {
  console.log('Received message from server:', data);
  chrome.runtime.sendMessage({ type: 'message', data: data });
});

// Add more event listeners as needed
socket.on('error', (data) => {
  console.log('Received error from server:', data);
  chrome.runtime.sendMessage({ type: 'error', data: data });
});

// You can also define functions to emit events from other parts of your extension
function emitTestEvent(data) {
  socket.emit('testing', data, (response) => {
    console.log('Response from server:', response);
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "createRoom") {
    console.log("background.js received createRoom message:", message.data);
    socket.emit('createRoom', message.data.roomId, message.data.userId);
  }
  if (message.type === "joinRoom") {
    console.log("background.js received joinRoom message:", message.data);
    socket.emit('joinRoom', message.data.roomId, message.data.userId);
  }
});
