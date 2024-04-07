import { io, type Socket } from "socket.io-client";
import type Board from "./Board";

interface ServerToClientEvents {
  receivePlayerNumber: () => number;
  receiveBoard: () => Board;
}

interface ClientToServerEvents {
  sendMove: (data: string) => void;
}

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();

export default socket;
