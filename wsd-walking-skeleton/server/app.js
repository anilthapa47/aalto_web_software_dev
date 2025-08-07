import { Hono } from "jsr:@hono/hono@4.6.5";

const app = new Hono();

let cards = [];

app.get("/cards", (c) => c.json({ cards }));

app.post("/cards", async (c) => {
  const body = await c.req.json();
  cards.push(body);
  return c.json({ cards });
});

app.delete("/cards/:id", (c) => {
  const id = c.req.param("id");
  cards = cards.filter((card) => card.id !== id);
  return c.json({ cards });
});

Deno.serve(app.fetch);


Deno.serve({ port: 3000 }, app.fetch);