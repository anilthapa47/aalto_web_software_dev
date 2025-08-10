<script>
    import { onMount } from "svelte";
    import { fetchQuestions, AddQuestions } from "$lib/apis/server-api.js";

    let spells = $state([]);
    let questions = [];

    const loadQuestions = async () => {
        questions = await fetchQuestions();
        console.log("Questions loaded:", questions);
    };

    async function handleAdd({ title, text }) {
        await addQuestion(title, text);
        await loadQuestions();
    }

    onMount(() => {
        loadSpells();
    });
</script>

<button onclick={loadQuestions}>loadQuestions</button>
<button onclick={handleAdd}>handleAdd</button>
<ul>
    {#each questions as question}
        <li>{question.text}</li>
    {/each}
</ul>
