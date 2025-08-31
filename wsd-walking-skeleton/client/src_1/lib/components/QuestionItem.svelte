<!--
<script>
  import { useTodoState } from "$lib/states/todoState.svelte.js";

  let todoState = useTodoState();
  export let todo; // ✅ props in Svelte
</script>

<div
  class="todo-item flex items-center space-x-4 card border-[2px] p-4 border-gray-300"
>
  <span class="text-xl">{todo.done ? "✅" : "❌"}</span>
  <span class="grow">{todo.name}</span>
  <button class="text-2xl" on:click={() => todoState.remove(todo.id)}>🗑</button
  >
</div>

<style>
  .todo-item {
    padding: 0.5rem;
    border-bottom: 1px solid #ddd;
  }
</style>


-->
<script>
  import { createEventDispatcher } from "svelte";
  export let q;
  export let courseId;
  const dispatch = createEventDispatcher();

  async function upvote() {
    const res = await fetch(
      `/api/courses/${courseId}/questions/${q.id}/upvote`,
      { method: "POST" },
    );
    if (res.ok) {
      const updated = await res.json();
      dispatch("updated", updated);
    }
  }

  async function remove() {
    const res = await fetch(`/api/courses/${courseId}/questions/${q.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      dispatch("deleted", q.id);
    }
  }
</script>

<li>
  <strong>{q.title}</strong> ({q.upvotes})
  <button on:click={upvote}>Upvote</button>
  <button on:click={remove}>Delete</button>
</li>
