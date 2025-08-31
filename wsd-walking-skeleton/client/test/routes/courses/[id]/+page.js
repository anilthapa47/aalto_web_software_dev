/** @type {import('./$types').PageLoad} */
export async function load({ params, fetch }) {
    const courseRes = await fetch(`/api/courses/${params.id}`);
    const questionsRes = await fetch(`/api/courses/${params.id}/questions`);

    if (!courseRes.ok || !questionsRes.ok) {
        return { status: 404 };
    }

    const course = await courseRes.json();
    const questions = await questionsRes.json();

    return { course, questions };
}
