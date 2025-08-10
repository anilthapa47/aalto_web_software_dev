import { PUBLIC_API_URL } from "$env/static/public";

export async function fetchQuestions() {
    const res = await fetch(`${PUBLIC_API_URL}/courses/1/questions`);
    return await res.json();
}

export async function AddQuestions(question) {
    const res = await fetch(`${API_URL}/courses/1/questions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(question),
    });
    return await res.json();
}
