// src/sockets/roomSocket.js

import { Server, Socket } from 'socket.io';
import { createRoom, getRoomData, joinRoom, leaveRoom, saveRoomVideoDetails } from '../services/roomService';
import { Room, VideoDetails } from '../types/types';
import { handleError } from '../lib/errors';

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
      handleError(error,socket)
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
      handleError(error,socket)
    }
  });

  const handleOnLeaveRoom = () =>{
    console.log(`User ${socket.id} disconnected \n`)
    try{
      const {roomId, userId, isEmpty} = leaveRoom(socket.id);
      socket.leave(roomId);
      socket.to(roomId).emit('message', `User ${userId} left the room`);
      socket.emit('message', `You got disconnected`);

      if(isEmpty) return true;
      const data:Room = getRoomData(roomId);
      io.to(data.name).emit('roomData', data);
      return true;
    }catch(error:any){
      handleError(error,socket)
      return false;
    }
  }

  socket.on('leaveRoom', (callback)=>{
    let status = handleOnLeaveRoom();
    if(status)
      callback(true); //return ture if leave Room is true
    else
      callback(false)
  });

  socket.on('disconnect', ()=>{
    handleOnLeaveRoom();
  });

  socket.on('shareVideoToRoom', (VideoDetails:VideoDetails, callback) => {
    try{
      const room:Room = saveRoomVideoDetails(VideoDetails.videoLink, VideoDetails.videoElementJsPath, socket.id);
      io.to(room.name).emit('roomData', room);
    }catch(error:any){
      handleError(error,socket)
    }
  })

  socket.on("testing", (data,callback)=>{
    console.log(data)
    callback("done testing");
  })
  
};

export default handleRoomSocket;