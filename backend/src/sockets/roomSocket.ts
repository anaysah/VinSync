// src/sockets/roomSocket.js

import { Server, Socket } from 'socket.io';
import { allUsers, createRoom, joinRoom, leaveRoom } from '../services/roomService';

// var rooms: { [roomId: string]: { users: string[] } } = {};

const handleRoomSocket = (socket:Socket, io:Server) => {
  socket.on('createRoom', (roomId, userId) => {
    console.log("createRoom request")
    try {
      createRoom(socket.id, roomId, userId);
      socket.join(roomId);
      socket.emit('message', roomId);
    } catch (error:any) {
      socket.emit('error', error.message);
    }
  });

  socket.on('joinRoom', (roomId, userId) => {
    // console.log(roomId, userId)
    try {
      joinRoom(socket.id, roomId, userId);
      socket.join(roomId);
      // socket.to(roomId).emit('message', userId);
      socket.emit('message', roomId, userId);
    } catch (error: any) {
      socket.emit('error', error.message);
    }
  });

  
  socket.on('disconnect',()=> leaveRoom(socket.id));

  // socket.on('disconnect', () =>{
  //   console.log(`rooms: ${Array.from(io.sockets.adapter.rooms.keys())}`)
  //   console.log(`rooms: ${Array.from(socket.rooms)}`)
  // })

  socket.on('allRooms', allUsers);

  socket.on('testing', (agr1:string, callback:Function)=>{
    console.log("")
    // callback("pinging all")
    // socket.join("mori")
    // callback(Array.from(socket.rooms), socket.id);
    console.log(`rooms: ${Array.from(io.sockets.adapter.rooms.keys())}`)
    console.log(`rooms: ${Array.from(socket.rooms)}`)
    // console.log("")
    // Array.from(socket.rooms).map(a=>console.log(a));
    // console.log(Array.from(io.sockets.adapter.rooms.keys()));
    // console.log(`socketId is ${socket.id}`)
    console.log("")
  });
};

export default handleRoomSocket;