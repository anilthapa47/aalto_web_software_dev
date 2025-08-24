<script>
    import { onMount, tick } from "svelte";
    export let data;

    let course = data.course;
    let questions = data.questions;

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
            { method: "POST" },
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

<h1>{course.name}</h1>

<h2>Questions</h2>
{#if questions.length > 0}
    <ul>
        {#each questions as q}
            <li>
                <strong>{q.title}</strong> — Upvotes: {q.upvotes}
                <button on:click={() => upvoteQuestion(q.id)}>Upvote</button>
                <button on:click={() => deleteQuestion(q.id)}>Delete</button>
            </li>
        {/each}
    </ul>
{:else}
    <p>Upvotes: 0</p>
{/if}

<h3>Add a new question</h3>
<form on:submit|preventDefault={addQuestion}>
    <input
        type="text"
        bind:value={title}
        placeholder="Question title"
        required
    />
    <textarea bind:value={text} placeholder="Question text" required></textarea>
    <button type="submit">Add Question</button>
</form>
