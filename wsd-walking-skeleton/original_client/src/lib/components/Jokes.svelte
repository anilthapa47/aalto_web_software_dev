<script>
    import { getRandomJoke } from "$lib/apis/joke-api.js";

    let joke = null;
    let loading = false;
    let error = null;

    const loadJoke = async () => {
        loading = true;
        error = null;
        joke = null;

        try {
            joke = await getRandomJoke();
        } catch (err) {
            error = err.message;
        } finally {
            loading = false;
        }
    };
</script>

<button on:click={loadJoke}>Load joke</button>

{#if loading}
    <p>Loading a joke...</p>
{:else if error}
    <p style="color: red">{error}</p>
{:else if joke}
    <p>{joke.setup}</p>
    <p>{joke.punchline}</p>
{/if}
