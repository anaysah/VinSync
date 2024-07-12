const Home = () => {
  const heightLight = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "startHighlighting" });
    });
  };

  const playVideo = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "playVideo" });
    });
  };

  const pauseVideo = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "pauseVideo" });
    });
  }


  return (
    <div>
      <div>
        <p>
          click the below button to share the video with your friends. only
          admin can share the video
        </p>
        <button className="bg-yellow-200 p-1 w-full rounded text-slate-500 active:bg-yellow-300">
          Share Video
        </button>
        <div className="flex gap-2">
          <button onClick={heightLight} className="active:bg-blue-500">Heighlight</button>
          <button onClick={playVideo} className="active:bg-blue-500">Play Video</button>
          <button onClick={pauseVideo} className="active:bg-blue-500">pause Video</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
