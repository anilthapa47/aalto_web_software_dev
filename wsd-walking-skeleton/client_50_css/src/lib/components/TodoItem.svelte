<script>
  import { useTodoState } from "$lib/states/todoState.svelte.js";
  let todoState = useTodoState();

  let { todo } = $props();
</script>

<div class="flex items-center space-x-4 card border-[2px] p-4 border-gray-300">
  <span class="text-xl">{todo.done ? "✅" : "❌"}</span>
  <span class="grow">{todo.name}</span>
  <button class="text-2xl" onclick={() => todoState.remove(todo.id)}>🗑</button>

</div>