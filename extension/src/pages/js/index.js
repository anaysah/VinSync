const createRoomBtn = document.getElementById('createRoomBtn')
const joinRoomBtn = document.getElementById('joinRoomBtn')

createRoomBtn.addEventListener('click', () =>{
    console.log("Create Room Request")
    chrome.runtime.sendMessage({ type: 'createRoom', data: {roomId:"room1", userId:"ajay"} });

})