// src/sockets/roomSocket.js

import { Server, Socket } from 'socket.io';
import { createRoom, getRoomData, joinRoom, leaveRoom } from '../services/roomService';
import { Room } from 'vinsync';

const handleRoomSocket = (socket:Socket, io:Server) => {
  socket.on('createRoom', (roomId, userId) => {
    console.log(`User ${userId} requested ${roomId} creation`)
    try {
      const data:Room = createRoom(socket.id, roomId, userId);
      socket.join(roomId);
      socket.emit('message', `You created the room ${roomId}`);
      socket.emit('message', `You joined the room ${roomId}`);
      io.to(data.name).emit('roomData', data);
    } catch (error:any) {
      socket.emit('error', error.message);
    }
  });

  socket.on('joinRoom', (roomId, userId) => {
    console.log(`User ${userId} requested ${roomId} join`)
    try {
      const data:Room = joinRoom(socket.id, roomId, userId);
      socket.join(roomId);
      socket.to(roomId).emit('message', `User ${userId} joined the room`);
      socket.emit('message', `You joined the room ${roomId}`);
      io.to(data.name).emit('roomData', data);
    } catch (error: any) {
      socket.emit('error', error.message);
    }
  });

  const handleOnLeaveRoom = () =>{
    console.log(`User ${socket.id} disconnected \n`)
    try{
      const {roomId, userId} = leaveRoom(socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit('message', `User ${userId} left the room`);
      socket.emit('message', `You got disconnected`);
      const data:Room = getRoomData(roomId);
      io.to(data.name).emit('roomData', data);
    }catch(error:any){
      socket.emit('error', error.message);
    }
  }

  socket.on('leaveRoom', ()=>{
    handleOnLeaveRoom();
  });

  socket.on('disconnect', ()=>{
    handleOnLeaveRoom();
  });
  
  // socket.on('allRooms', allRooms);

  socket.on("testing", (data,callback)=>{
    console.log(data)
    callback("done testing");
  })
  
};

export default handleRoomSocket;