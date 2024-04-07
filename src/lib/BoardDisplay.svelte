<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type Board from "./Board";
  import type Slot from "./Slot";
  import { SlotValues } from "./Slot";
  import SlotDisplay from "./SlotDisplay.svelte";

  export let board: Board;
  export let playerNumber: number;
  export let roomNumber: number;

  const dispatch = createEventDispatcher();

  const handleSlotClicked = (slot: Slot) => {
    dispatch("slotClicked", { slot });
  };

  const handleBoardReset = () => {
    dispatch("resetBoard");
  };
</script>

<div
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
  <h3>Room #{roomNumber}</h3>
</div>

<style preprocess="scss">
  .game-board {
    width: 100%;
    display: grid;
    grid-gap: 5rem;
  }
</style>
