<script>
  import { PUBLIC_API_URL } from "$env/static/public";

  let query = $state("");
  let result = $state([]);

  const executeQuery = async () => {
    const response = await fetch(PUBLIC_API_URL, {
      method: "POST",
      body: JSON.stringify({ query }),
    });

    result = await response.json();
  };

  const runSQL = async () => {
    result = await executeQuery(query);
  };

</script>



<h1>SQL Interface</h1>

<h2>Write query here</h2>

<textarea bind:value={query}></textarea><br />
<button onclick={runSQL}>Execute query</button>

<h2>Query results:</h2>

<p>{JSON.stringify(result)}</p>