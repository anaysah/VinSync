// src/sockets/roomSocket.js

import { Server, Socket } from 'socket.io';
import { allRooms, createRoom, joinRoom, leaveRoom } from '../services/roomService';

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
      socket.to(roomId).emit('message', `User ${userId} joined the room`);
      socket.emit('message', `You joined the room ${roomId}`);
    } catch (error: any) {
      socket.emit('error', error.message);
    }
  });

  socket.on('leaveRoom', ()=>{
    leaveRoom(socket.id, socket);
    socket.leave(socket.id);
  });
  
  socket.on('disconnect',()=> leaveRoom(socket.id, socket));

  socket.on('allRooms', allRooms);

  
};

export default handleRoomSocket;