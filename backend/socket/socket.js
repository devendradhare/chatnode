import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const onlineUsers = {};

export const getReceiverSocketId = (receiverId) => {
  return onlineUsers[receiverId];
};

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("user connected : ", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId !== undefined) onlineUsers[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(onlineUsers));

  socket.on("disconnect", () => {
    console.log("user disconnected : ", socket.id);
    delete onlineUsers[userId];
    io.emit("getOnlineUsers", Object.keys(onlineUsers));
  });
});

export { app, io, server };
