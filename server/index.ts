import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import Board from "../src/lib/Board";
import type { MoveRequest } from "../src/lib/Interfaces";

const PORT: number = parseInt(process.env.PORT!) || 8080;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("sendMove", (data: string) => {
    const { move, boardState } = JSON.parse(data) as MoveRequest;
    const board: Board = Board.createBoardFromBoardState(boardState);
    board.markSlotWithCoordinates(move.xCoordinate, move.yCoordinate);

    io.emit("receiveBoard", board);
  });

  socket.on("resetBoard", () => {
    const board: Board = new Board();

    io.emit("receiveBoard", board);
  });

  socket.on("disconnect", () => {
    console.log("Client left");
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
