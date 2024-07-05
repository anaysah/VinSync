if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

import express, { Application, Request, Response } from 'express';
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import handleRoomSocket from './sockets/roomSocket';

const app: Application = express();
const port: number = Number(process.env.PORT) || 3000;
const httpServer = createServer(app);
const io:Server = new Server(httpServer)


// Socket handling
io.on('connection', (socket:Socket) => {
  console.log(`Socket connected: ${socket.id}`);
  handleRoomSocket(socket, io);
  
  socket.on('error', (error: Error) => {
    console.error('Socket error:', error);
  });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});