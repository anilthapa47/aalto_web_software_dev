import { Hono } from "jsr:@hono/hono@4.6.5";

const app = new Hono();

let temperature = 20;

app.get("/temperature", (c) => c.json({ temperature }));
app.post("/temperature", (c) => {
  temperature++;
  return c.json({ temperature });
});
app.delete("/temperature", (c) => {
  temperature--;
  return c.json({ temperature });
});
app.put("/temperature", async (c) => {
  const temp_put = await c.req.json();
  temperature = temp_put.temperature;
  return c.json({ temperature });
});


Deno.serve({ port: 3000 }, app.fetch);