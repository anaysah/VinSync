import { useEffect, useState } from "react";
import { Room } from "vinsync";

const RoomInfo = () => {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    chrome.runtime.sendMessage({type:"getRoom"})
  },[])

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "room") {
      setRoom(message.data);
    }
  });

  const onLeave = () =>{
    chrome.runtime.sendMessage({type:"leaveRoom"})
    chrome.runtime.sendMessage({type:"getRoom"})
  }


  return (
    <div className="p-1 border flex-1">
        <div>
          <span>Room:</span>
          <span className="text-primary font-bold">{room?.name}</span> 
          {
            room && (<button className="underline text-blue-700 float-right" onClick={onLeave}>Leave</button>)
          }
        </div>
        <div id="membersList">
          <div>Members: </div>
          <ul>
            {room && Object.keys(room.members).map((member) => (
              <li key={member}>{room.members[member].name}</li>
            ))}
          </ul>
        </div>
    </div>
  )
}

export default RoomInfo