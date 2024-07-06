// src/services/roomService.ts

import { Socket } from "socket.io";
import { Room, Rooms } from "vinsync";

var rooms:Rooms = {};
var socketRoomMapping: { [socketId: string]: string } = {};

const createRoom = (socketId: string ,roomId: string, userId: string):Room => {
  console.log(socketRoomMapping,"::" ,rooms);
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
  return {name:roomId, members:rooms[roomId]}
};

const joinRoom = (socketId: string, roomId: string, userId: string): Room => {
  console.log(socketRoomMapping,"::" ,rooms);

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
  return {name:roomId, members:rooms[roomId]}
};

const leaveRoom = (scoketId: string ):{userId:string, roomId:string} =>{
  const roomId = socketRoomMapping[scoketId];
  const userId = rooms[roomId][scoketId].name;
  if (!roomId) {
    throw new Error('User is not in a room');
  }
  
  delete rooms[socketRoomMapping[scoketId]][scoketId]
  delete socketRoomMapping[scoketId]
  return {userId:userId, roomId:roomId};
}

// const allRooms = (message:string, callback:Function): Room => {
//   console.log(JSON.stringify(rooms));
//   callback(JSON.stringify(rooms));
// };

const getRoomData = (roomId: string): Room => {
  return {name:roomId, members:rooms[roomId]}
}


export {
  createRoom,
  joinRoom,
  // allRooms,
  leaveRoom,
  getRoomData
};
