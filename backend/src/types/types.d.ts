// Use interfaces for User and Room structures
interface User {
  name: string;
  socketId?: string;
  isAdmin: boolean;
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
  videoLink?: string;
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

// Add 'declare' or 'export' modifier to top-level declarations in .d.ts file

type FromToType = "contentScripts" | "extension" | "background";

interface BroadcastMessage {
  action: string;
  data: any;
  type: "BroadcastMessage";
  from: FromToType;
  to: FromToType[];
}

export type { BroadcastMessage, FromToType }

interface Home{
  highlighting: boolean;
}

export { Home }