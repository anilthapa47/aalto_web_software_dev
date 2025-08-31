<!--
<script>
  import TodoForm from "./QuestionsForm.svelte";
  import TodoList from "./QuestionsList.svelte";
</script>

<h1>Todos</h1

<h2 class="p-4 mb-4 bg-gray-100 rounded-lg text-center">Add Todo</h2>

<TodoForm />

<h2 class="p-4 mb-4 bg-gray-100 rounded-lg text-center">Existing todos</h2>

<TodoList />
-->
<script>
  import { onMount } from "svelte";
  import QuestionList from "./QuestionList.svelte";
  import QuestionForm from "./QuestionForm.svelte";

  export let courseId;
  let questions = [];

  async function loadQuestions() {
    const res = await fetch(`/api/courses/${courseId}/questions`);
    questions = await res.json();
  }

  function handleAdd(q) {
    questions = [...questions, q];
  }

  function handleDelete(id) {
    questions = questions.filter((q) => q.id !== id);
  }

  function handleUpdate(q) {
    questions = questions.map((item) => (item.id === q.id ? q : item));
  }

  onMount(loadQuestions);
</script>

<QuestionList
  {questions}
  {courseId}
  on:deleted={(e) => handleDelete(e.detail)}
  on:updated={(e) => handleUpdate(e.detail)}
/>

<QuestionForm {courseId} on:added={(e) => handleAdd(e.detail)} />
