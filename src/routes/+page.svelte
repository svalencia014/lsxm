<script lang="ts">
  let station: string;
  let start: Date;
  let end: Date;

  async function scrobble() {
    await fetch('/', {
      method: 'POST',
      body: JSON.stringify({
        station,
        start,
        end
      })
    })
  }
</script>

<div class="flex h-screen items-center justify-center">
  <div class="relative w-full max-w-sm rounded-lg border border-gray-300 bg-white p-8 shadow-lg">
    <label for="station">Station Number:</label>
    <input type="text" id="station" class="outline" bind:value={station}>
    <label for="start">Start Time:</label>
    <input type="datetime-local" id="start" class="outline" bind:value={start}>
    <label for="end">End Time:</label>
    <input type="datetime-local" id="end" class="outline" bind:value={end}>
    <button on:click={() => {scrobble()}}>Scrobble</button>
  </div>
</div>
