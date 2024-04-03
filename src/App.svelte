<script lang="ts">
  import Board from "./lib/Board";
  import type Slot from "./lib/Slot";
  import SlotDisplay from "./lib/SlotDisplay.svelte";

  let board = new Board();

  const handleSlotClicked = (slot: Slot) => {
    board.markSlot(slot);
    board = board.refresh();
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
</main>

<style>
  .game-board {
    display: grid;
    grid-gap: 5rem;
  }
</style>
