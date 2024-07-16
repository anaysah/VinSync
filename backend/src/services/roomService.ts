// src/services/roomService.ts

import { CustomError } from "../lib/errors";
import {  Room, Rooms, User, VideoControl, VideoDetails } from "../types/types";

var rooms:Rooms = {};
var socketRoomMapping: { [socketId: string]: string } = {};

const createRoom = (socketId: string ,roomId: string, userId: string):Room => {
  console.log(socketRoomMapping,"::" ,rooms);
  if (!roomId) {
    throw new CustomError('Room ID is required');
  }
  if (!userId) {
    throw new CustomError('User ID is required');
  }
  if (socketRoomMapping[socketId]){
    throw new CustomError('User is already in a room');
  }

  // Check if the room already exists
  if (rooms[roomId]) {
    throw new CustomError('Room already exists');
  }
  // Create a new room
  rooms[roomId] = {
    name:roomId,
    members:{
      [socketId]: {name:userId, isAdmin:true}
    }
  };

  socketRoomMapping[socketId] = roomId;

  console.log(rooms);
  return rooms[roomId];
};

const joinRoom = (socketId: string, roomId: string, userId: string): Room => {
  console.log(socketRoomMapping,"::" ,rooms);

  if (!roomId) {
    throw new CustomError('Room ID is required');
  }
  if (!userId) {
    throw new CustomError('User ID is required');
  }
  if (socketRoomMapping[socketId]){
    throw new CustomError('You are already in the room');
  }

  // Check if the room exists
  if (!rooms[roomId]) {
    throw new CustomError('Room not found');
  }
  if (rooms[roomId].members[socketId]) {
    throw new CustomError('You are already in the room');
  }

  // Add the user to the room
  const newUser:User = {name:userId, isAdmin:false}
  rooms[roomId].members[socketId] = newUser;
  socketRoomMapping[socketId] = roomId;
  return rooms[roomId];
};

const leaveRoom = (scoketId: string ):{userId:string, roomId:string, isEmpty:boolean} =>{
  const roomId = socketRoomMapping[scoketId];
  const userId = rooms[roomId].members[scoketId].name;
  if (!roomId) {
    throw new CustomError('User is not in a room');
  }
  
  delete rooms[socketRoomMapping[scoketId]].members[scoketId]
  delete socketRoomMapping[scoketId]
  const isEmpty = Object.keys(rooms[roomId].members).length === 0;
  if (isEmpty) {
    delete rooms[roomId];
  }
  return {userId:userId, roomId:roomId, isEmpty:isEmpty};
}

// const allRooms = (message:string, callback:Function): Room => {
//   console.log(JSON.stringify(rooms));
//   callback(JSON.stringify(rooms));
// };

const getRoomData = (roomId: string): Room => {
  if (!roomId) {
    throw new CustomError('Room ID is required');
  }
  // Check if the room exists
  if (!rooms[roomId]) {
    throw new CustomError('Room not found');
  }
  return rooms[roomId];
};

const saveRoomVideoDetails = (videoLink:string, videoElementJsPath:string, socketId:string):Room=>{
  const roomId = socketRoomMapping[socketId];
  if (!roomId) {
    throw new CustomError('User is not in a room');
  }
  rooms[roomId].VideoDetails = {videoLink:videoLink, videoElementJsPath:videoElementJsPath}
  return rooms[roomId];
}

export {
  createRoom,
  joinRoom,
  // allRooms,
  leaveRoom,
  getRoomData,
  saveRoomVideoDetails
};
