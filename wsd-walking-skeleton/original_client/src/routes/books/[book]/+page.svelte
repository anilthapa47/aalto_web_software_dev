<script>
    import { PUBLIC_API_URL } from "$env/static/public";

    let { data } = $props();
    let book = $state({});

    const getBook = async () => {
        const response = await fetch(`${PUBLIC_API_URL}/books/${data.book}`);
        book = await response.json();
    };

    $effect(() => {
        getBook();
    });
</script>

<p>Book title: {book?.title}</p>
