<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Slot, { SlotValues } from "./Slot";

  export let slot: Slot;

  const dispatch = createEventDispatcher();

  const handleClick = () => {
    if (slot.value === SlotValues.empty) {
      dispatch("marked");
    }
  };
</script>

<button
  class:winningSlot={slot.isWinning}
  on:click={handleClick}
  disabled={slot.isMarked}
>
  {slot.value}
</button>

<style preprocess="scss">
  button {
    height: 150px;
    width: 150px;
    font-size: 3em;

    &.winningSlot {
      background-color: greenyellow;
    }

    &:disabled {
      &:hover {
        border: none;
        cursor: not-allowed;
      }
    }
  }
</style>
