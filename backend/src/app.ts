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
  console.log('a user connected');
  handleRoomSocket(socket, io);

  
  socket.on("test", () => {
    // socket.broadcast.emit('hi');
    // socket.emit('test', 'Hello Testing event!');
    // console.log('test event received', data);
    io.emit('testing', io.engine.clientsCount);
  })

  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  // });

  socket.on('error', (error: Error) => {
    console.error('Socket error:', error);
  });

  // setInterval(() => {
  //   io.emit('interval', { timestamp: Date.now() });
  // }, 2000);
});


httpServer.listen(3000, () => {
  console.log(`Server is running on port ${port}`);
});