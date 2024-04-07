<script lang="ts">
  import { Socket, io } from "socket.io-client";
  import Board from "./lib/Board";
  import type { BoardState, MoveRequest } from "./lib/Interfaces";
  import type Slot from "./lib/Slot";

  import BoardDisplay from "./lib/BoardDisplay.svelte";
  import Lobby from "./lib/Lobby.svelte";
  import { SlotValues } from "./lib/Slot";

  let isConnected = false;
  let board = new Board();
  let playerNumber: number;
  let socket: Socket | null = null;
  let clientRoomNumber: number = -1;

  const attemptConnection = (roomNumber: number) => {
    // WebSocket setup
    socket = io(import.meta.env.VITE_WS_ENDPOINT);

    socket.emit("joinRoom", JSON.stringify({ roomNumber }));

    socket.on("receivePlayerNumber", (data: number) => {
      playerNumber = data;
    });
    socket.on("receiveRoomNumber", (data: number) => {
      clientRoomNumber = data;
      isConnected = true;
    });
    socket.on("receiveBoard", (data: Board) => {
      const boardState: BoardState = JSON.parse(JSON.stringify(data));
      const newBoard = Board.createBoardFromBoardState(boardState);
      board = newBoard;
    });
    socket.on("swapPlayers", () => {
      playerNumber = (playerNumber + 1) % 2;
    });
  };

  const handleSlotClicked = (slot: Slot) => {
    if (isBoardClickable() && clientRoomNumber > 0) {
      const data: MoveRequest = {
        move: {
          marker: board.getCurrentPlayerMark(),
          xCoordinate: slot.positionX,
          yCoordinate: slot.positionY,
        },
        boardState: JSON.parse(JSON.stringify(board)) as BoardState,
        roomNumber: clientRoomNumber,
      };

      if (socket) {
        socket.emit("sendMove", JSON.stringify(data));
      }
    }
  };

  const handleBoardReset = () => {
    if (socket) {
      socket.emit(
        "resetBoard",
        JSON.stringify({ roomNumber: clientRoomNumber })
      );
    }
  };

  const isBoardClickable = () => {
    const playerMark = (playerNumber - 1) % 2 ? SlotValues.x : SlotValues.o;
    return !board.isGameOver() && board.getCurrentPlayerMark() === playerMark;
  };
</script>

<main>
  {#if !isConnected || clientRoomNumber < 0}
    <Lobby on:connect={(e) => attemptConnection(e.detail.roomNumber)} />
  {:else}
    <BoardDisplay
      {playerNumber}
      roomNumber={clientRoomNumber}
      {board}
      on:resetBoard={handleBoardReset}
      on:slotClicked={(e) => handleSlotClicked(e.detail.slot)}
    />
  {/if}
</main>

<style preprocess="scss">
</style>
