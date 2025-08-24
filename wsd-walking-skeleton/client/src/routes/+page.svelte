//<!--//-->
<script>
  import Todo from "$lib/components/Todo.svelte";
  import { fade } from "svelte/transition";

  let todos = $state([
    { name: "First todo", done: false },
    { name: "Second todo", done: true },
    { name: "Third todo", done: false },
  ]);

  const remove = (todo) => {
    todos = todos.filter((t) => t !== todo);
  };
</script>

<ul class="space-y-4">
  {#each todos as todo (todo.name)}
      <li transition:fade>
      <Todo {todo} removeTodo={() => remove(todo)} />
    </li>
  {/each}
</ul>

<!--
<form class="space-y-4">
  <label class="label" for="name">
    <span class="label-text">Todo</span>
    <input
      class="input"
      id="name"
      name="name"
      type="text"
      placeholder="Todo name"
    />
  </label>
  <label class="flex items-center space-x-2" for="done">
    <input id="done" name="done" type="checkbox" />
    <p>Done</p>
  </label>
  <button class="w-full btn preset-filled-primary-500" type="submit"
    >Add todo</button
  >
</form>
-->