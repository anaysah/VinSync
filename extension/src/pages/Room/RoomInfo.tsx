import { useEffect, useState } from "react";
import { DataOperationsMessage, Room } from "../../types/types";

const RoomInfo = () => {
  const [room, setRoom] = useState<Room>();

  useEffect(() => {
    const getRoomMessage: DataOperationsMessage = {
      type: "DataOperations",
      action: "getRoom",
      from: "extension",
      to: ["background"]
    };

    chrome.runtime.sendMessage(getRoomMessage,setRoom);

    const messageListener = (message, sender, sendResponse) => {
      if (message.type === "DataOperations") {
        if(message.action === "setRoom")
          setRoom(message.data);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const onLeave = () => {
    const leaveRoomMessage: DataOperationsMessage = {
      type: "DataOperations",
      action: "leaveRoom",
      from: "extension",
      to: ["background"]
    };

    chrome.runtime.sendMessage(leaveRoomMessage,(response:boolean)=>{
      if(response){
        setRoom(undefined);
      }
    });

  };


  return (
    <div className="p-1 border flex-1">
        <div>
          <span className="mr-2">Room:</span>
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