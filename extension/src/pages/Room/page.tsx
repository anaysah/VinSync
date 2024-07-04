import { useState } from "react";

const Room = () => {
  const [roomId, setRoomId] = useState("");
  const [userId, setUserId] = useState("");

  const createRoom = () => {
    if (roomId && userId) {
      console.log("Create Room Request")
      chrome.runtime.sendMessage({ type: 'createRoom', data: {roomId:roomId, userId:userId} });
    }
  }

  const joinRoom = () => {
    if (roomId && userId) {
      console.log("Join Room Request")
      chrome.runtime.sendMessage({ type: 'joinRoom', data: {roomId:"room1", userId:"ajay"} });
    }
  }

  return (
    <div className="flex flex-col">
      <div className="border border-3">
        <input onChange={e => setRoomId(e.target.value)} value={roomId} type="text" name="roomId" placeholder="Room Name" className="w-full focus:outline-none focus:ring-none"/>
      </div>
      <div className="border border-3">
        <input onChange={e => setUserId(e.target.value)} value={userId} type="text" name="userId" placeholder="User Name" className="w-full focus:outline-none focus:ring-none"/>
      </div>
      <div className="mt-2 flex gap-2">
        <button id="createRoomBtn" onClick={createRoom} className="bg-blue-500 text-white p-1 rounded">Create Room</button>
        <button id="joinRoomBtn" onClick={joinRoom} className="bg-blue-500 text-white p-1 rounded">Join Room</button>
        <button id="leaveRoomBtn" className="bg-blue-500 text-white p-1 rounded">Leave Room</button>
      </div>
    </div>
  )
}

export default Room