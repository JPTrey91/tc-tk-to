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

interface RoomNumberArg {
  roomNumber: number;
}

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("joinRoom", (data: string) => {
    const { roomNumber } = JSON.parse(data) as RoomNumberArg;

    socket.join(`${roomNumber}`);

    playerCount = io.sockets.adapter.rooms.get(roomNumber).size;

    console.log(`Joining room ${roomNumber} with ${playerCount} players.`);

    socket.emit("receivePlayerNumber", ++playerCount % 2);
    socket.emit("receiveRoomNumber", roomNumber);
  });

  socket.on("sendMove", (data: string) => {
    const { move, boardState, roomNumber } = JSON.parse(data) as MoveRequest;
    const board: Board = Board.createBoardFromBoardState(boardState);
    board.markSlotWithCoordinates(move.xCoordinate, move.yCoordinate);

    io.to(`${roomNumber}`).emit("receiveBoard", board);
  });

  socket.on("resetBoard", (data: string) => {
    const { roomNumber } = JSON.parse(data);
    const board: Board = new Board();

    io.to(`${roomNumber}`).emit("receiveBoard", board);
    io.to(`${roomNumber}`).emit("swapPlayers");
  });

  socket.on("disconnect", () => {
    console.log("Client left");
  });
});

server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
  playerCount = 0;
});
