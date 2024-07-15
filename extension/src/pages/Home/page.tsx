import { FastForward, Pause, Play, Rewind } from "lucide-react";
import { useEffect, useState } from "react";
import { BroadcastMessage, Home } from "../../types/types";

const Home = () => {
  const [highlighting, setHighlighting] = useState(false);

  const handleControl = (action) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: action });
    });
  };

  useEffect(() => {
    chrome.runtime.sendMessage({type:"dataFetching", action: "getHomeData"}, (response:Home) => {
      const newHighlighting = response.highlighting;
      setHighlighting(newHighlighting);
    })

    const messageListener = (message, sender, sendResponse) => {
      if (message.type === "BroadcastMessage") {
        let m = message;
        if (m.to.includes("extension")) {
          if (m.action === "setHighlighting") {
            setHighlighting(m.data.highlighting);
          }
        }
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  const setHighlightingState = () => {
    const newHighlighting = !highlighting;
    setHighlighting(newHighlighting);
    
    let m:BroadcastMessage = {
      type: "BroadcastMessage",
      action: "setHighlighting",
      data: { highlighting: newHighlighting },
      to: ["contentScripts"],
      from: "extension",
    };

    chrome.runtime.sendMessage(m);
  };



  return (
    <div>
      <div>
        <p>
          Only admin can share the video
        </p>
        <p>After Clicking hover to the video and click to Video from the webpage</p>
        <button 
        onClick={setHighlightingState}
        className="bg-yellow-200 p-1 w-full rounded text-slate-500 active:bg-yellow-400 hover:bg-yellow-300 my-2">
          {highlighting ? "Stop Highlighting" : "Select Video"}
        </button>
        <p>After chossing the video please test the below contorls before sharing the video</p>

        <div className="border p-1 flex flex-col gap-1 mt-2">
          <div><center>Video Testing</center></div>
          <hr />
          <div id="testing" className="gap-2 flex justify-center items-center">
            <button onClick={()=>handleControl("rewind")} className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1">
              <Rewind className="w-4 h-4"/>
            </button>
            <button onClick={()=>handleControl("playVideo")} className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 ">
              <Play className="w-4 h-4"/>
            </button>
            <button onClick={()=>handleControl("pauseVideo")} className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1">
              <Pause className="w-4 h-4"/>
            </button>
            <button onClick={()=>handleControl("fastForward")} className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1">
            <FastForward className="w-4 h-4"/>
            </button>
          </div>
        </div>
        <button
        className="bg-sky-600 hover:bg-sky-800 active:bg-sky-700 p-1 w-full rounded text-white font-bold mt-2"
        >
          Share to the room
        </button>
      </div>
    </div>
  );
};

export default Home;
