<script>
  import TodoForm from "./TodoForm.svelte";
  import TodoList from "./TodoList.svelte";
</script>

<!--<h1>Todos</h1>-->

<h2 class="p-4 mb-4 bg-gray-100 rounded-lg text-center">Add Todo</h2>

<TodoForm />

<h2 class="p-4 mb-4 bg-gray-100 rounded-lg text-center">Existing todos</h2>

<TodoList />
