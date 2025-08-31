<script>
    import { onMount, tick } from "svelte";

    let courses = [];
    let name = "";

    async function loadCourses() {
        const res = await fetch("/api/courses");
        if (res.ok) {
            courses = await res.json();
            await tick(); // ensure DOM updates
        }
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
            await tick(); // ensure DOM updates
        }
    }

    onMount(loadCourses);
</script>

<h1 class="text-2xl font-bold text-gray-800 mb-6">Courses</h1>
<ul class="space-y-3 mb-8">
    {#each courses as c}
        <li class="p-4 bg-gray-100 rounded-lg shadow hover:bg-gray-200">
            <a
                href={`/courses/${c.id}`}
                class="text-blue-600 font-medium hover:underline"
            >
                {c.name}
            </a>
        </li>
    {/each}
</ul>

<h2 class="text-xl font-semibold text-gray-700 mb-4">Add a new course</h2>
<form on:submit|preventDefault={addCourse} class="space-y-4 max-w-md">
    <input
        class="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500"
        type="text"
        bind:value={name}
        placeholder="Course name"
        name="name"
        required
    />
    <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
    >Add course</button>
</form>
