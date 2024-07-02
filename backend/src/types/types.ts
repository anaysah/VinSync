interface User {
  name: string;
  // Add more properties as needed
}

interface Room {
  [userSocketId: string]: User;
}

interface Rooms {
  [roomId: string]: Room;
}

export { User, Room, Rooms };