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
            {room && Object.keys(room.members).map((memberId) => {
              const member = room.members[memberId];
              const isAdmin = member.isAdmin; // Assuming isAdmin is a boolean indicating admin status

              return (
                <>
                <hr />
                <li key={memberId} className="flex items-center py-0.5">
                  <span>{member.name}</span>
                  <span className="ml-auto flex justify-center items-center">
                  {isAdmin && (
                    <span
                      className="inline-block w-5 h-5 bg-yellow-300 text-neutral-600 rounded-full text-center"
                      title="Admin"
                    >
                      A
                    </span>
                  )}
                  </span>
                </li>
                </>
              );
            })}
            <hr />
          </ul>
        </div>
    </div>
  )
}

export default RoomInfo