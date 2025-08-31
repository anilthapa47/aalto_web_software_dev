<!--
<script>
  import { useTodoState } from "$lib/states/todoState.svelte.js";
  let todoState = useTodoState();

  const addTodo = (e) => {
    const todo = Object.fromEntries(new FormData(e.target));
    todo.id = crypto.randomUUID();
    todoState.add(todo);
    e.target.reset();
    e.preventDefault();
  };
</script>

<form class="space-y-4" onsubmit={addTodo}>
  <label class="label" for="name">
    <span class="label-text">Todo</span>
    <input
      class="input"
      id="name"
      name="name"
      type="text"
      placeholder="Enter a new todo"
    />
  </label>
  <label class="flex items-center space-x-2" for="done">
 
      <input id="done" name="done" type="checkbox" />
      <p>Done</p>
  </label>

  
  <button class="mb-4 w-full btn preset-filled-primary-500" type="submit" value="Add Todo">Add todo</button>
</form>

<!--
<form onsubmit={addTodo}>
  <label for="name">Todo</label>
  <input id="name" name="name" type="text" placeholder="Enter a new todo" />
  <div>
    <input id="done" name="done" type="checkbox" />
    <label for="done">Done</label>
  </div>
  <input type="submit" value="Add Todo" />
</form>
-->


<script>
  import { createEventDispatcher } from "svelte";
  export let courseId;
  let title = "";
  let text = "";
  const dispatch = createEventDispatcher();

  async function submit() {
    const res = await fetch(`/api/courses/${courseId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text })
    });
    if (res.ok) {
      const newQ = await res.json();
      dispatch("added", newQ);
      title = "";
      text = "";
    }
  }
</script>

<form on:submit|preventDefault={submit}>
  <input name="title" bind:value={title} placeholder="Question title" required />
  <textarea name="text" bind:value={text} placeholder="Question text" required />
  <button type="submit">Add Question</button>
</form>


