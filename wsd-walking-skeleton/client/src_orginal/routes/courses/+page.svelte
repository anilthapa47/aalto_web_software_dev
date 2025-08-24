<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";

    let courses = [];
    let name = "";

    async function loadCourses() {
        const res = await fetch("/api/courses");
        if (res.ok) courses = await res.json();
    }

    async function addCourse(e) {
        e.preventDefault();
        if (!name.trim()) return;

        const res = await fetch("/api/courses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name }),
        });

        if (res.ok) {
            const newCourse = await res.json();
            courses = [...courses, newCourse];
            name = "";
        }
    }

    function goToCourse(id) {
        goto(`/courses/${id}`);
    }

    onMount(loadCourses);
</script>

<h1>Courses</h1>

<ul>
    {#each courses as c}
        <li>
            <!-- use a button to ensure client-side navigation -->
            <button
                on:click={() => goToCourse(c.id)}
                style="all: unset; cursor: pointer;"
            >
                {c.name}
            </button>
        </li>
    {/each}
</ul>

<h2>Add a new course</h2>
<form on:submit|preventDefault={addCourse}>
    <input type="text" bind:value={name} placeholder="Course name" required />
    <button type="submit">Add course</button>
</form>
