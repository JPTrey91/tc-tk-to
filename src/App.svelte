<script lang="ts">
  import Board from "./lib/Board";
  import type { BoardState, Move, MoveRequest } from "./lib/Interfaces";
  import type Slot from "./lib/Slot";
  import { SlotValues } from "./lib/Slot";
  import SlotDisplay from "./lib/SlotDisplay.svelte";
  import { io } from "socket.io-client";

  let board = new Board();
  let playerNumber: number;

  // WebSocket setup
  const socket = io(import.meta.env.VITE_WS_ENDPOINT, {});

  socket.on("receivePlayerNumber", (data: number) => {
    playerNumber = data;
  });

  socket.on("receiveBoard", (data: Board) => {
    const boardState: BoardState = JSON.parse(JSON.stringify(data));
    const newBoard = Board.createBoardFromBoardState(boardState);
    board = newBoard;
  });

  const isBoardClickable = () => {
    return !board.isGameOver() && board.getTurnCount() % 2 === playerNumber - 1;
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

      socket.emit("sendMove", JSON.stringify(data));
    }
  };

  const handleBoardReset = () => {
    socket.emit("resetBoard");
  };
</script>

<main
  class="game-board"
  style="grid-template-columns: repeat({board.getBoardDimensions().y}, 1fr);
    grid-template-rows: repeat({board.getBoardDimensions().x}, 1fr);"
>
  {#each board.getBoard() as slotRow}
    {#each slotRow as slot}
      <SlotDisplay {slot} on:marked={() => handleSlotClicked(slot)} />
    {/each}
  {/each}

  {#if board.isGameOver()}
    {#if board.isGameDrawn()}
      <h1>Draw!</h1>
    {:else}
      <h1>{board.getWinner()} wins!</h1>
    {/if}
  {:else}
    <h1>{board.getCurrentPlayerMark()}'s turn</h1>
  {/if}

  <button on:click={handleBoardReset}>Reset</button>

  <h4>Turn #{board.getTurnCount()}</h4>
  <h3>You are {(playerNumber - 1) % 2 ? SlotValues.x : SlotValues.o}</h3>
</main>

<style>
  .game-board {
    display: grid;
    grid-gap: 5rem;
  }
</style>
