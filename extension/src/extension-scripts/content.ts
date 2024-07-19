import { log } from "../helpers/logger";
import { BroadcastMessage, DataOperationsMessage, VideoDetails, VideoState } from "../types/types";

var videoElement: HTMLVideoElement | null = null;
var videoDetails: VideoDetails | null = null;
var videoState:VideoState | null = null;
var highlighting = false;
let overlayElement: HTMLElement | null = null;

// This function will run whenever the videoElement gets changes
var onVideoElementVarChange = () => {
  if (!videoElement) return;
  addVideoEventListeners();
};

// this is watcher who watches for videoElement value changes. it runs function automatically if var values changes
var videoElementW = {
  get value() {
      return videoElement;
  },
  set value(newValue) {
      videoElement = newValue;
      onVideoElementVarChange();
  }
};

// This function will run whenever the videoState gets changes
var onVideoStateVarChange = () => {
  if (!videoState) return;
};

// this is watcher who watches for videoState value changes. it runs function automatically if var values changes
var videoStateW = {
  get value() {
      return videoState;
  },
  set value(newValue) {
      videoState = newValue;
      onVideoStateVarChange();
  }
};

//utils functions
function getJSPath(element) {
  if (!element) return; // If element is not provided

  let path = '';
  const pathSegments = [];

  while (element) {
      let selector = getElementSelector(element);
      pathSegments.unshift(selector);
      element = element.parentElement;
  }

  path = pathSegments.join(' > ');
  return path;
}

function getElementSelector(element) {
  if (!element) return '';

  let selector = '';
  const id = element.id;
  const classes = Array.from(element.classList).join('.');
  const tagName = element.tagName.toLowerCase();

  if (id) {
      selector = `#${id}`;
  } else if (classes) {
      selector = `${tagName}.${classes}`;
  } else {
      selector = tagName;
  }

  return selector;
}
//utils funtions over

//-----Overylay functions
function createOverlay() {
  //wuill create a new overlay
  overlayElement = document.createElement('div');
  overlayElement.style.position = 'absolute';
  overlayElement.style.pointerEvents = 'none';
  overlayElement.style.backgroundColor = 'rgba(135, 206, 235, 0.5)'; // Translucent skyblue background color
  overlayElement.style.zIndex = '10'; // Ensure overlay is on top

  // Add dashed diagonal lines
  overlayElement.style.backgroundImage = `
    linear-gradient(135deg, rgba(255,255,255,0.5) 25%, transparent 25%),
    linear-gradient(225deg, rgba(255,255,255,0.5) 25%, transparent 25%),
    linear-gradient(45deg, rgba(255,255,255,0.5) 25%, transparent 25%),
    linear-gradient(315deg, rgba(255,255,255,0.5) 25%, transparent 25%)
  `;
  overlayElement.style.backgroundSize = '20px 20px'; // Size of the pattern
  overlayElement.style.backgroundPosition = '0 0, 10px 10px, 10px 10px, 0 0'; // Positioning the pattern

  document.body.appendChild(overlayElement);
}

function updateOverlay(target: HTMLElement) {
  //it will change the position of the overlay everytime mouse moves to new element
  const rect = target.getBoundingClientRect();
  if (!overlayElement) {
    return;
  }
  overlayElement.style.width = `${rect.width}px`;
  overlayElement.style.height = `${rect.height}px`;
  overlayElement.style.top = `${rect.top + window.scrollY}px`;
  overlayElement.style.left = `${rect.left + window.scrollX}px`;
}

function clickOverlay(target) {
  //this will create a new overlay which will show a "video selected message"
  const messageElement = document.createElement('div');
  messageElement.innerText = 'Video Selected';
  messageElement.style.position = 'absolute';
  messageElement.style.color = 'white';
  messageElement.style.fontSize = '20px';
  messageElement.style.backgroundColor = 'black';
  messageElement.style.padding = '10px 20px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.zIndex = '10001'; // Ensure message is on top of the overlay
  messageElement.style.opacity = '0';
  messageElement.style.transition = 'opacity 0.5s ease';

  // Calculate the position relative to the video element
  const videoRect = target.getBoundingClientRect();
  messageElement.style.top = `${videoRect.top + videoRect.height / 2}px`;
  messageElement.style.left = `${videoRect.left + videoRect.width / 2}px`;
  messageElement.style.transform = 'translate(-50%, -50%)';

  // Append the message element to the body (or parent element of the video)
  document.body.appendChild(messageElement);

  // Show the message
  setTimeout(() => {
      messageElement.style.opacity = '1';

      setTimeout(() => {
          messageElement.style.opacity = '0';

          // Remove the message element from the DOM after it fades out
          setTimeout(() => {
              document.body.removeChild(messageElement);
          }, 500); // Delay matches the transition duration
      }, 1000); // Show the message for 1 second
  }, 50); // Small delay to ensure message is visible after append
}




function highlightElement(target: HTMLElement) {
  if (target && highlighting && target.tagName !="IFRAME") {
    if (!overlayElement) {
      createOverlay();
    }
    updateOverlay(target);
  }
}

function removeHighlight() {
  if (overlayElement) {
    overlayElement.remove();
    overlayElement = null;
  }
}
//---Overlay function ends here


function onMouseoverElements(event){
  if (highlighting && event.target instanceof HTMLElement) {
    //when mouse is over a element it will hightlight the element with overlay
    highlightElement(event.target as HTMLElement) 
  }
}


function onClickElements(event) {
  // Prevent default behavior and stop event propagation
  event.preventDefault();
  event.stopPropagation();
  if (highlighting && event.target instanceof HTMLVideoElement) {
    videoElementW.value = event.target; // Sets the video element
    const path = getJSPath(event.target); 
    path && setRoomVideoDetails(path); // sets the Room Video Details in backround.js
    broadcastToggleHighlightToAllContentScripts();  //this stop highligting in all frames
    clickOverlay(event.target);  // this show a "video selected message if video found"
  }
}

function broadcastToggleHighlightToAllContentScripts() {
  //their can be multiple content.js if video is in a iframe
  //this will send a message to background to change toggle highlight to every content.js
  let m:BroadcastMessage = {
    type:"BroadcastMessage",
    action: "setHighlighting",
    data:{"highlighting": (!highlighting)},
    to:["contentScripts", "extension"],
    from:"contentScripts",
  }
  chrome.runtime.sendMessage(m);
}

function setRoomVideoDetails(path:string){
  //to set the videoDetails in background.js
  let m:DataOperationsMessage = {
    type:"DataOperations",
    action:"setRoomVideoDetails",
    data:{"path":path},
    to:['background'],
    from:"contentScripts",
  }
  chrome.runtime.sendMessage(m);
}

// Videostates functions starts here -----------------------------------------
function addVideoEventListeners() {  //function to add event listner on the videoElement
  if(!videoElement) return;

  // videoElement.addEventListener('play', handleVideoListener)

  videoElement.addEventListener('pause', handleVideoListener)

  videoElement.addEventListener('playing', handleVideoListener)

  videoElement.addEventListener('waiting', handleVideoListener)

  // videoElement.addEventListener('timeupdate', handleVideoListener)

  videoElement.addEventListener('seeked', handleVideoListener)

}

function removeVideoEventListeners() {
  if (!videoElement) return;

  videoElement.removeEventListener('pause', handleVideoListener);

  videoElement.removeEventListener('playing', handleVideoListener);

  videoElement.removeEventListener('waiting', handleVideoListener);

  videoElement.removeEventListener('seeked', handleVideoListener);
}


function handleVideoListener(){
  if (!videoElement) return;
  let videoState:VideoState = makeVideoState();
  updateVideoStateInRoom(videoState);
  log("content script", `Video state updated V:${videoElement?.paused}`)
}

function makeVideoState() {
  if (!videoElement) return;
  let newVideoState:VideoState = {
    isPlaying: !videoElement.paused && !videoElement.ended && videoElement.readyState > 2,
    isBuffering: videoElement.readyState < 4 && videoElement.networkState == videoElement.NETWORK_LOADING,
    currentTime: videoElement.currentTime,
    playbackRate: videoElement.playbackRate,
  };
  return newVideoState;
}


function updateVideoStateInRoom(videoState:VideoState) {
  let m:DataOperationsMessage = {
    type:"DataOperations",
    action:"updateVideoState",
    data:{"videoState":videoState},
    to:['background'],
    from:"contentScripts",
  }
  chrome.runtime.sendMessage(m);
}

async function setVideoElementByState() {
  if (!videoElement || !videoState) return;
  if (videoState.isBuffering) {
    // Custom handling for buffering state, if needed
    try {
      await videoElement.pause();
      return;
    } catch (error) {
      log("content script", `Error pausing video for buffering: ${error}`);
    }
  }

  // Set current time if different by more than the tolerance
  const TOLERANCE_SECONDS = 2; // Adjust this value as needed
  if (Math.abs(videoElement.currentTime - videoState.currentTime) > TOLERANCE_SECONDS) {
    videoElement.currentTime = videoState.currentTime;
  }

  // if(videoState.currentTime !== videoElement.currentTime){
  //   videoElement.currentTime = videoState.currentTime;
  // }

  // Set playback rate if different
  if (videoElement.playbackRate !== videoState.playbackRate) {
    videoElement.playbackRate = videoState.playbackRate; //
  }

  // Play or pause the video based on the state
  if (videoState.isPlaying && videoElement.paused) {
    try {
      await videoElement.play();
    } catch (error) {
      log("content script", `Error playing video: ${error}`);
    }
  } else if (!videoState.isPlaying && !videoElement.paused) {
    try {
      await videoElement.pause();
    } catch (error) {
      log("content script", `Error pausing video: ${error}`);
    }
  }

  log("content script", "Video element state set by videoState");
}


// Videostates functions ends here-----------------------------------------------

// functions for set video element when page loades -----------------------
const handleMutations = function(mutationsList: MutationRecord[], observer: MutationObserver) {
  for (let mutation of mutationsList) {
    if (mutation.type === 'childList') {
      mutation.addedNodes.forEach(node => {
        if (node.nodeName.toLowerCase() === 'video' && getJSPath(node as HTMLElement) === videoDetails?.videoElementJsPath) {
          videoElementW.value = node as HTMLVideoElement;
          // log("content script", 'A video element has been added');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          const videos = (node as HTMLElement).querySelectorAll('video');
          videos.forEach(video => {
            if (getJSPath(video) === videoDetails?.videoElementJsPath) {
              videoElementW.value = video;
              // log("content script", 'A video element has been found within a new element');
            }
          });
        }
      });
    }
  }
};

function getAndSetVideoDetails(): Promise<void> {
  return new Promise((resolve, reject) => {
    let getVideoLinkMessage: DataOperationsMessage = {
      type: "DataOperations",
      action: "getVideoDetails",
      to: ["background"],
      from: "contentScripts",
    };

    chrome.runtime.sendMessage(getVideoLinkMessage, (response: VideoDetails) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        videoDetails = response;
        resolve();
      }
    });
  });
}

function setVideoElementFromJSpath(){
  if (videoDetails && videoDetails.videoElementJsPath) {
    const path = videoDetails.videoElementJsPath;
    try {
      videoElementW.value = document.querySelector(path) as HTMLVideoElement;
      if (videoElement) {
        // console.log("Video element found:", videoElement);
        log("content script", "Video element found")
      } else {
        log("content script", "Video element not found")
      }
    } catch (error) {
      log("content script", "Video element not found")
    }
  }
}

// will complete these two functinos in future if needed
// function getVideoStateFromServer(){
//   let m:DataOperationsMessage = {
//     type:"DataOperations",
//     action:"getVideoState",
//     to:['background'],
//     from:"contentScripts",
//   }
//   chrome.runtime.sendMessage(m);
// }

// function setVideoStateOnElementFound(){

// }

window.addEventListener('load', function() {
  log("content script", "Page fully loaded");
  getAndSetVideoDetails()
    .then(() => {
      setVideoElementFromJSpath(); // its will find video element normally with query selector

      //if video element is added dynamicallly
      const observer = new MutationObserver(handleMutations);
      const targetNode = document.body;
      const config = { childList: true, subtree: true };
      observer.observe(targetNode, config);

    })
    .catch(error => {
      log("content script", `Error: ${error}`);
      console.error("Error:", error);
    });
});
// functions for set video element when page loades ends here -----------------------

function addEventListenerToHighlight(){
  document.addEventListener('mouseover', onMouseoverElements);
  
  document.addEventListener('mouseout', removeHighlight);
  
  document.addEventListener('click', onClickElements);
}

function removeEventListenerToHighlight(){
  document.removeEventListener('click', onClickElements);
  
  document.removeEventListener('mouseover', onMouseoverElements);
  
  document.removeEventListener('mouseout', removeHighlight);

  removeHighlight();
}

chrome.runtime.onMessage.addListener(async(request, sender, sendResponse) => {
  if (request.type === "BroadcastMessage" ) {
    let m:BroadcastMessage = request;
    if (m.to.includes("contentScripts")) {
      if(m.action === 'setHighlighting'){
        // log("content script", m)
        highlighting = m.data.highlighting; // can be true or false
        if(highlighting) addEventListenerToHighlight();
        else removeEventListenerToHighlight();
      }
      if (m.action == "VideoControl" && videoElement) {
        switch (request.data.Control) {
          case 'playVideo':
            console.log('play video');
            videoElement.play();
            break;
          case 'pauseVideo':
            console.log('pause video');
            videoElement.pause();
            break;
          case 'rewind':
            console.log('rewind');
            (videoElement.currentTime -= 10);
            break;
          case 'fastForward':
            console.log('fast forward');
            (videoElement.currentTime += 10);
            break;
          default:
            console.log('Unknown control action');
            break;
        }
      }
    }
  }
  else if(request.type === "DataOperations"){
    let m:DataOperationsMessage = request;
    if(m.from === "background" && m.to.includes("contentScripts")){
      if(m.action=="updateVideoVideoElementByState" && videoElement){
        removeVideoEventListeners();
        videoState = m.data.videoState;
        await setVideoElementByState();
        addVideoEventListeners();
      }
    }
  }
});