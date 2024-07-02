// src/services/roomService.ts

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
    throw new Error('User is already in a room');
  }

  // Check if the room exists
  if (!rooms[roomId]) {
    throw new Error('Room not found');
  }
  if (rooms[roomId][socketId]) {
    throw new Error('User is already in the room');
  }

  // Add the user to the room
  rooms[roomId][socketId] = {name:userId};
  socketRoomMapping[socketId] = roomId;
};

const leaveRoom = (scoketId: string ): void =>{
  // console.log(joinedRooms)
  // for (const roomId in joinedRooms) {
  //   if (roomId in rooms){
  //     delete rooms[roomId][scoketId];
  //   }
  // }
  // console.log(`${scoketId} left ${joinedRooms}`)
  delete rooms[socketRoomMapping[scoketId]][scoketId]
  delete socketRoomMapping[scoketId]
}

const allUsers = (message:string, callback:Function): void => {
  console.log(JSON.stringify(rooms));
  // callback(rooms);
  // return Object.keys(rooms);
};

export {
  createRoom,
  joinRoom,
  allUsers,
  leaveRoom
};
