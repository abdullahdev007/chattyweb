import { Server, Socket } from "socket.io";
import express, { Application } from "express";
import http, { Server as HTTPServer } from "http";

import dotenv from "dotenv";
dotenv.config();

const app: Application = express();

const server: HTTPServer = http.createServer(app);
const io: Server = new Server(server, {
  cors: {
    origin: [process.env.APP_URL as string],
    methods: ["GET", "POST"],
  },
});

const userSocketMap: Record<string, string> = {};

export const getSocketId = (receiverId: string): string | undefined => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket: Socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId as string | undefined;
  if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("a user disconnect", socket.id);
    if (userId) delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
