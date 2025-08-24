<script>
    import { tick } from "svelte";
    export let data;

    let course = data?.course ?? null;
    let questions = data?.questions ?? [];

    let title = "";
    let text = "";

    async function addQuestion(e) {
        e.preventDefault();
        if (!title.trim() || !text.trim()) return;

        const res = await fetch(`/api/courses/${course.id}/questions`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, text }),
        });

        if (res.ok) {
            const newQ = await res.json();
            questions = [...questions, newQ];
            title = "";
            text = "";
            await tick();
        }
    }

    async function upvoteQuestion(qId) {
        const res = await fetch(
            `/api/courses/${course.id}/questions/${qId}/upvote`,
            {
                method: "POST",
            },
        );
        if (res.ok) {
            const updatedQ = await res.json();
            questions = questions.map((q) => (q.id === qId ? updatedQ : q));
            await tick();
        }
    }

    async function deleteQuestion(qId) {
        const res = await fetch(`/api/courses/${course.id}/questions/${qId}`, {
            method: "DELETE",
        });
        if (res.ok) {
            questions = questions.filter((q) => q.id !== qId);
            await tick();
        }
    }
</script>

{#if course}
    <h1 class="text-2xl font-bold text-gray-800 mb-6">{course.name}</h1>

    <h2 class="text-xl font-semibold text-gray-700 mb-4">Questions</h2>
    <ul class="space-y-4 mb-8">
        {#if questions.length > 0}
            {#each questions as q}
                <li
                    class="p-4 bg-white border rounded-lg shadow flex items-center justify-between"
                >
                    <strong class="block text-gray-800">{q.title}</strong>
                    <span class="text-gray-600">Upvotes: {q.upvotes}</span>
                    <button on:click={() => upvoteQuestion(q.id)}>Upvote</button
                    >
                    <button on:click={() => deleteQuestion(q.id)}>Delete</button
                    >
                </li>
            {/each}
        {:else}
            <li>No questions yet</li>
        {/if}
    </ul>

    <h3 class="text-lg font-semibold text-gray-700 mb-4">Add a new question</h3>
    <form on:submit|preventDefault={addQuestion} class="space-y-4 max-w-lg">
        <input
            type="text"
            name="title"
            bind:value={title}
            placeholder="Question title"
            required
        />
        <textarea
            name="text"
            bind:value={text}
            placeholder="Question text"
            required
        ></textarea>
        <button
            type="submit"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
            Add Question
        </button>
    </form>
{:else}
    <!-- fallback so the page doesn't crash -->
    <p>Loading course…</p>
{/if}
