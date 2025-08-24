import { Hono } from "jsr:@hono/hono@4.6.5";
import { getCookie, setCookie } from "jsr:@hono/hono@4.6.5/cookie";

const app = new Hono();


const COOKIE_KEY = "auth";

app.get("/count", async (c) => {
  let count = getCookie(c, COOKIE_KEY);
  count = count ? parseInt(count) + 1 : 1;
  setCookie(c, COOKIE_KEY, count);
  return c.json({ count });
});

export default app;