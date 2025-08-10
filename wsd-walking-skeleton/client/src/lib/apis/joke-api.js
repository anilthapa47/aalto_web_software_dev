import { PUBLIC_JOKES_API_URL } from "$env/static/public";

export async function getRandomJoke() {
    const response = await fetch(`${PUBLIC_JOKES_API_URL}/random`);
    if (!response.ok) {
        throw new Error("Failed to fetch joke");
    }
    return await response.json();
}