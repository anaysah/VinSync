var videoElement;

let highlighting = false;
let previousElement = null;

function highlightElement(event) {
  if (previousElement) {
    previousElement.style.outline = "";
  }
  event.target.style.outline = "2px solid red";
  previousElement = event.target;

  let videoData = {
    tagName: event.target.tagName,
    id: event.target.id,
    className: event.target.className,
    src: event.target.src,
    // Add any other properties you're interested in
  };

  chrome.runtime.sendMessage({ type: 'log', data: videoData });
}

function clickElement(event) {
  console.log(event.target);
  videoElement = event.target;

  // Extract relevant data from the video element
  let videoData = {
    tagName: videoElement.tagName,
    id: videoElement.id,
    className: videoElement.className,
    src: videoElement.src,
    // Add any other properties you're interested in
  };

  chrome.runtime.sendMessage({ type: 'log', data: videoData });
  event.preventDefault();
  event.stopPropagation();
  removeHighlighter();
}

function addHighlighter() {
  document.addEventListener("mouseover", highlightElement);
  document.addEventListener("click", clickElement, true);
}

function removeHighlighter() {
  document.removeEventListener("mouseover", highlightElement);
  document.removeEventListener("click", clickElement, true);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startHighlighting") {
    highlighting = !highlighting;
    if (highlighting) {
      addHighlighter();
    } else {
      removeHighlighter();
    }
  } else if (request.action === "playVideo") {
    console.log("play video");
    videoElement && videoElement.play();
  } else if (request.action === "pauseVideo") {
    console.log("pause video");
    videoElement && videoElement.pause();
  }
});
