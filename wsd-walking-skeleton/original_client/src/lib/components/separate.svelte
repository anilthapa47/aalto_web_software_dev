<script>
    import * as todosApi from "../lib/apis/todos-api.js";

    let loading = $state(true);
    let todos = $state([]);

    const getTodos = async () => {
        loading = true;
        todos = await todosApi.readTodos();
        loading = false;
    };

    $effect(() => {
        getTodos();
    });
</script>

<h1>Todos</h1>

{#if loading}
    <p>Loading todos...</p>
{:else}
    <ul>
        {#each todos as todo}
            <li>{todo.name}</li>
        {/each}
    </ul>
{/if}
