<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let roomNumber = 1;
  let isConnecting = false;
  const dispatch = createEventDispatcher();

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    isConnecting = true;
    dispatch("connect", { roomNumber });
  };
</script>

<form on:submit={(e) => handleSubmit(e)} class:isConnecting>
  <label
    >Room #
    <input type="number" placeholder="Room #" bind:value={roomNumber} min="1" />
  </label>
  <button type="submit">Connect{isConnecting ? "ing..." : ""}</button>
</form>

<style preprocess="scss">
  form {
    align-items: center;
    justify-content: center;
    width: 100%;

    &.isConnecting {
      pointer-events: none;
      opacity: 0.4;
    }
  }
</style>
