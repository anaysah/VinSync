import { FastForward, Link, Pause, Play, Rewind, SquareArrowOutUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { BroadcastMessage, DataOperationsMessage, Home, VideoControl, VideoDetails } from "../../types/types";

const Home = () => {
  const [highlighting, setHighlighting] = useState(false);
  const [videoDetails, setVideoDetails] = useState<VideoDetails>();

  const handleControl = (control:VideoControl) => {
    let m:BroadcastMessage = {
      type: "BroadcastMessage",
      action: "VideoControl",
      data: { Control: control },
      to: ["contentScripts"],
      from: "extension",
    }
    chrome.runtime.sendMessage(m);
  };

  useEffect(() => {
    let m:DataOperationsMessage = {
      type: "DataOperations",
      action: "getHomeData",
      to: ["background"],
      from: "extension",
    }
    chrome.runtime.sendMessage(m, (response:Home) => {
      const newHighlighting = response.highlighting;
      setHighlighting(newHighlighting);
    })

    let getVideoLinkMessage:DataOperationsMessage = {
      type: "DataOperations",
      action: "getVideoDetails",
      to: ["background"],
      from: "extension",
    }
    chrome.runtime.sendMessage(getVideoLinkMessage,setVideoDetails)
    

    const messageListener = (message, sender, sendResponse) => {
      if (message.type === "BroadcastMessage") {
        let m = message;
        if (m.to.includes("extension")) {
          if (m.action === "setHighlighting") {
            setHighlighting(m.data.highlighting);
          }
        }
      }
      if (message.type === "DataOperations") {
        if(message.action === "setRoom")
          setVideoDetails(message.data.VideoDetails)
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
        <p>Only admin can share the video</p>
        <p>
          After Clicking hover to the video and click to Video from the webpage
        </p>
        <button
          onClick={setHighlightingState}
          className="bg-yellow-200 p-1 w-full rounded text-slate-500 active:bg-yellow-400 hover:bg-yellow-300 my-2"
        >
          {highlighting ? "Stop Highlighting" : "Select Video"}
        </button>
        <p>
          After chossing the video please test the below contorls before sharing
          the video
        </p>

        <div className="border p-1 flex flex-col gap-1 mt-2">
          <div>
            <center>Video Testing</center>
          </div>
          <hr />
          <div id="testing" className="gap-2 flex justify-center items-center">
            <button
              onClick={() => handleControl("rewind")}
              className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1"
            >
              <Rewind className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleControl("playVideo")}
              className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1 "
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleControl("pauseVideo")}
              className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleControl("fastForward")}
              className="rounded bg-blue-500 hover:bg-blue-700 text-white font-bold p-1"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>
        </div>
        {videoDetails?.videoLink ? (
          <a href={videoDetails.videoLink} target="_blank" rel="noopener noreferrer">
            <button className="bg-sky-600 hover:bg-sky-800 active:bg-sky-700 p-1 w-full rounded text-white font-bold mt-2 flex gap-1 justify-center items-center">
              {/* <span>Video Link: </span> */}
              <marquee>{videoDetails.videoLink}</marquee>
              <SquareArrowOutUpRight className="w-4 h-4" />
            </button>
          </a>
        ) : (
          <button className="bg-sky-600 hover:bg-sky-800 active:bg-sky-700 p-1 w-full rounded text-white font-bold mt-2 flex gap-1 justify-center items-center">
            No Video Shared
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
