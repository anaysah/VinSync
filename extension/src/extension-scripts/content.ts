import { BroadcastMessage } from "../types/types";

var videoElement: HTMLVideoElement | null = null;
var highlighting = false;
let overlayElement: HTMLElement | null = null;

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
    videoElement = event.target; // Sets the video element
    broadcastToggleHighlightToAllContentScripts();
    clickOverlay(event.target);
  }
}


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



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "BroadcastMessage" ) {
    let m:BroadcastMessage = request;
    if (m.to.includes("contentScripts")) {
      if(m.action === 'setHighlighting'){
        // log("content script", m)
        highlighting = m.data.highlighting; // can be true or false
        if(highlighting) addEventListenerToHighlight();
        else removeEventListenerToHighlight();
      }
    }
  }
  else if (request.type="videoContorl") {
    if(request.action === 'playVideo'){
      console.log('play video');
      videoElement && videoElement.play();
    }
    else if (request.action === 'pauseVideo') {
      console.log('pause video');
      videoElement && videoElement.pause();
    }
    else if(request.action === 'rewind'){
      console.log('rewind');
      videoElement && (videoElement.currentTime -= 10);
    }
    else if(request.action === 'fastForward'){
      console.log('fast forward');
      videoElement && (videoElement.currentTime += 10);
    }
  } 
});
