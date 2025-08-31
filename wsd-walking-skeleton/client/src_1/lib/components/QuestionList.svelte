<!--
<script>
  import { useTodoState } from "$lib/states/todoState.svelte.js";
  import TodoItem from "./QuestionsItem.svelte";

  let todoState = useTodoState();
</script>

<ul>
  {#each todoState.todos as todo}
    <li>
      <TodoItem {todo} />
    </li>
  {/each}
</ul>
-->

<script>
  import QuestionItem from "./QuestionItem.svelte";
  export let questions = [];
  export let courseId;
</script>

<ul>
  {#each questions as q}
    <QuestionItem {q} {courseId} on:deleted on:updated />
  {/each}
</ul>
