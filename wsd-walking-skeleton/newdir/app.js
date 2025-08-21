
import { Hono } from "jsr:@hono/hono@4.6.5";

const app = new Hono();

app.get("/", (c) => c.text("Hello World!"));

export default app;
