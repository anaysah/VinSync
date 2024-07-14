var videoElement: HTMLVideoElement | null = null;
var highlighting = false;
let overlayElement: HTMLElement | null = null;

//-----Overylay functions
function createOverlay() {
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
  const rect = target.getBoundingClientRect();
  if (!overlayElement) {
    return;
  }
  overlayElement.style.width = `${rect.width}px`;
  overlayElement.style.height = `${rect.height}px`;
  overlayElement.style.top = `${rect.top + window.scrollY}px`;
  overlayElement.style.left = `${rect.left + window.scrollX}px`;
}

function clickOverlay() {
  return new Promise<void>((resolve) =>  {
    if (!overlayElement) {
      resolve();
      return;
    }

    // Create a message element
    const messageElement = document.createElement('div');
    messageElement.innerText = 'Video Selected';
    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.color = 'white';
    messageElement.style.fontSize = '20px';
    messageElement.style.backgroundColor = "black";
    messageElement.style.padding = '10px 20px';
    messageElement.style.borderRadius = '5px';
    messageElement.style.zIndex = '10001'; // Ensure message is on top of the overlay
    messageElement.style.opacity = '0';
    messageElement.style.transition = 'opacity 0.5s ease';

    // Blink the overlay
    overlayElement.style.transition = 'background-color 0.2s ease';
    overlayElement.style.backgroundColor = 'rgba(135, 206, 235, 1)'; // Solid skyblue

    setTimeout(() => {
      overlayElement!.style.backgroundColor = 'rgba(135, 206, 235, 0.5)'; // Translucent skyblue
      overlayElement!.appendChild(messageElement); // Append message after color change

      // Show the message
      setTimeout(() => {
        messageElement.style.opacity = '1';

        setTimeout(() => {
          messageElement.style.opacity = '0';

          setTimeout(() => {
            overlayElement!.removeChild(messageElement);
            resolve();
          }, 500); // Wait for the message to fade out
        }, 1000); // Show the message for 1 second
      }, 50); // Small delay to ensure message is visible after append
    }, 200); // Wait for the overlay to change color
  });
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

// function setVideoElement(event) {
//   // event.preventDefault();
//   // event.stopPropagation();

//   console.log(event.target);
//   videoElement = event.target;

//   let videoData = {
//     tagName: videoElement?.tagName,
//     id: videoElement?.id,
//     className: videoElement?.className,
//     src: videoElement?.src,
//   };

//   chrome.runtime.sendMessage({ type: 'log', data: videoData });
  
// }

function onMouseoverElements(event){
  if (highlighting && event.target instanceof HTMLElement) {
    //when mouse is over a element it will hightlight the element with overlay
    highlightElement(event.target as HTMLElement) 
    // chrome.runtime.sendMessage({ type: 'log', data: {tagName: event.target?.tagName, id: event.target?.id, className: event.target?.className, src: event.target?.src} });
  }
}

let clickInProgress = false;

function onClickElements(event) {
  // Prevent default behavior and stop event propagation
  event.preventDefault();
  event.stopPropagation();

  // Check if a click event is already in progress
  if (clickInProgress) {
    return; // Exit the function if another click is being handled
  }

  // Set the flag to indicate that a click event is being processed
  clickInProgress = true;

  if (highlighting && event.target instanceof HTMLVideoElement) {
    videoElement = event.target; // Sets the video element
    
    clickOverlay().then(() => {
      broadcastToggleHighlightToAllContentScripts();
      // Reset the flag once the click event processing is complete
      clickInProgress = false;
    }).catch((error) => {
      console.error("Error during clickOverlay execution:", error);
      // Reset the flag in case of an error
      clickInProgress = false;
    });
  } else {
    // Reset the flag if the click did not involve a video element
    clickInProgress = false;
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
  chrome.runtime.sendMessage({type:"broadcastToContentScripts", action: 'toggleHighlighting' });
}



chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleHighlighting') {
    highlighting = !highlighting;
    // if(!highlighting) removeHighlight();
    // chrome.runtime.sendMessage({ type: 'log', data: `Highlighting: ${highlighting}` });
    if (highlighting) {
      addEventListenerToHighlight();
    } else {
      removeEventListenerToHighlight();
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
