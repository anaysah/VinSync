// src/services/roomService.ts

import { Socket } from "socket.io";
import { Rooms } from "../types/types";

var rooms:Rooms = {};
var socketRoomMapping: { [socketId: string]: string } = {};

const createRoom = (socketId: string ,roomId: string, userId: string): void => {
  if (!roomId) {
    throw new Error('Room ID is required');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (socketRoomMapping[socketId]){
    throw new Error('User is already in a room');
  }

  // Check if the room already exists
  if (rooms[roomId]) {
    throw new Error('Room already exists');
  }
  // Create a new room
  rooms[roomId] = {
    [socketId]: {name:userId}
  };

  socketRoomMapping[socketId] = roomId;

  console.log(rooms);
};

const joinRoom = (socketId: string, roomId: string, userId: string): void => {
  if (!roomId) {
    throw new Error('Room ID is required');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }
  if (socketRoomMapping[socketId]){
    throw new Error('You are already in the room');
  }

  // Check if the room exists
  if (!rooms[roomId]) {
    throw new Error('Room not found');
  }
  if (rooms[roomId][socketId]) {
    throw new Error('You are already in the room');
  }

  // Add the user to the room
  rooms[roomId][socketId] = {name:userId};
  socketRoomMapping[socketId] = roomId;
};

const leaveRoom = (scoketId: string, socket: Socket ): void =>{
  const roomId = socketRoomMapping[scoketId];
  if (!roomId) {
    throw new Error('User is not in a room');
  }
  socket.leave(roomId);
  socket.to(roomId).emit('message', `User ${rooms[roomId][scoketId].name} left the room`);
  delete rooms[socketRoomMapping[scoketId]][scoketId]
  delete socketRoomMapping[scoketId]
}

const allRooms = (message:string, callback:Function): void => {
  console.log(JSON.stringify(rooms));
  callback(JSON.stringify(rooms));
};

export {
  createRoom,
  joinRoom,
  allRooms,
  leaveRoom
};
