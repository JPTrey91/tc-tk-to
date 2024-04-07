const express = require("express");
import { Server } from "socket.io";
import { MoveRequest } from "./lib/Interfaces";
import Board from "./lib/Board";

const PORT: number = parseInt(process.env.PORT!) || 8080;
const app = express();
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: `${process.env.CLIENT_URL}`,
  },
});

let playerCount: number;

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.emit("receivePlayerNumber", (++playerCount % 2) + 1);

  socket.on("sendMove", (data: string) => {
    const { move, boardState } = JSON.parse(data) as MoveRequest;
    const board: Board = Board.createBoardFromBoardState(boardState);
    board.markSlotWithCoordinates(move.xCoordinate, move.yCoordinate);

    io.emit("receiveBoard", board);
  });

  socket.on("resetBoard", () => {
    const board: Board = new Board();

    io.emit("receiveBoard", board);
    io.emit("swapPlayers");
  });

  socket.on("disconnect", () => {
    console.log("Client left");
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
  playerCount = 0;
});
