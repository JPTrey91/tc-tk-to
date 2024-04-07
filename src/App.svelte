<script lang="ts">
  import { Socket, io } from "socket.io-client";
  import Board from "./lib/Board";
  import type { BoardState, MoveRequest } from "./lib/Interfaces";
  import type Slot from "./lib/Slot";

  import BoardDisplay from "./lib/BoardDisplay.svelte";
  import Lobby from "./lib/Lobby.svelte";

  let isConnected = false;
  let board = new Board();
  let playerNumber: number;
  let socket: Socket | null = null;

  const attemptConnection = (roomNumber: number) => {
    // WebSocket setup
    socket = io(import.meta.env.VITE_WS_ENDPOINT, {});

    socket.on("receivePlayerNumber", (data: number) => {
      playerNumber = data;
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
    if (isBoardClickable()) {
      const data: MoveRequest = {
        move: {
          marker: board.getCurrentPlayerMark(),
          xCoordinate: slot.positionX,
          yCoordinate: slot.positionY,
        },
        boardState: JSON.parse(JSON.stringify(board)) as BoardState,
      };

      if (socket) {
        socket.emit("sendMove", JSON.stringify(data));
      }
    }
  };

  const isBoardClickable = () => {
    return !board.isGameOver() && board.getTurnCount() % 2 === playerNumber - 1;
  };

  const handleBoardReset = () => {
    if (socket) {
      socket.emit("resetBoard");
    }
  };
</script>

<main>
  {#if !isConnected}
    <Lobby on:connect={(e) => attemptConnection(e.detail.roomNumber)} />
  {:else}
    <BoardDisplay
      {playerNumber}
      {board}
      on:resetBoard={handleBoardReset}
      on:slotClicked={(e) => handleSlotClicked(e.detail.slot)}
    />
  {/if}
</main>

<style preprocess="scss">
</style>
