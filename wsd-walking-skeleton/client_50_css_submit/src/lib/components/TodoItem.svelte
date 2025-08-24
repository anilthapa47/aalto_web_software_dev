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
