// Use interfaces for User and Room structures
interface User {
  name: string;
  socketId?: string;
  // Add more properties as needed
}

interface RoomMembers {
  [userSocketId: string]: User;
}

// Use type alias for Rooms since it is a map of room IDs to Room objects
type Rooms = {
  [roomId: string]: RoomMembers;
};

interface Room {
  name: string;
  members: RoomMembers;
}

export type { User, Room, Rooms, RoomMembers };

// Use type alias for log entry and collections of messages and errors
type LogEntry = {
  time: string;
  data: string;
};

type Messages = LogEntry[];
type Errors = LogEntry[];

export type { LogEntry, Messages, Errors };