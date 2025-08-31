import { Hono } from "jsr:@hono/hono@4.6.5";
import { getCookie, setCookie } from "jsr:@hono/hono@4.6.5/cookie";
import * as jwt from "jsr:@hono/hono@4.6.5/jwt";

import postgres from "postgres";
import { verify, hash } from "jsr:@denorg/scrypt@4.4.4"; // or your hashing lib
import { cors } from "jsr:@hono/hono@4.6.5/cors";
// or const cors = require("cors");

const sql = postgres(); // automatically gets credentials from env
const app = new Hono();

//cookie constants
const COOKIE_KEY = "auth";
const JWT_SECRET = "secret";

app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);



const userMiddleware = async (c, next) => {
  const token = getCookie(c, COOKIE_KEY);
  const { payload } = jwt.decode(token, JWT_SECRET);
  c.user = payload;
  await next();
};

app.use(
  "/api/notes/*",
  jwt.jwt({
    cookie: COOKIE_KEY,
    secret: JWT_SECRET,
  }),
);

app.use("/api/notes/*", userMiddleware);

app.get("/api/notes", async (c) => {
  const notes = await sql`SELECT * FROM notes WHERE user_id = ${c.user.id}`;
  return c.json(notes);
});

app.post("/api/notes", async (c) => {
  const { text } = await c.req.json();
  const result = await sql`INSERT INTO notes (user_id, text)
    VALUES (${c.user.id}, ${text}) RETURNING *`;
  return c.json(result[0]);
});

app.get("/api/notes/:id", async (c) => {
  const notes = await sql`SELECT * FROM notes
    WHERE id = ${c.req.param("id")} AND user_id = ${c.user.id}`;
  if (notes.length <= 0) {
    c.status(404);
    return c.json({ error: "Note not found" });
  }
  return c.json(notes[0]);
});

//const COOKIE_KEY = "auth";

//const COOKIE_KEY = "count";

app.get("/count", async (c) => {
  let count = getCookie(c, COOKIE_KEY);
  count = count ? parseInt(count) + 1 : 1;
  setCookie(c, COOKIE_KEY, count);
  return c.json({ count });
});




app.post("/api/auth/login", async (c) => {
  const data = await c.req.json();

  const result = await sql`SELECT * FROM users
    WHERE email = ${data.email.trim().toLowerCase()}`;

  if (result.length === 0) {
    return c.json({
      "message": "User not found!",
    });
  }

  const user = result[0];

  const passwordValid = await verify(data.password.trim(), user.password_hash);

  if (passwordValid) {
    // define the payload
    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 60,
    };

    // create the token by signing the payload
    const token = await jwt.sign(payload, JWT_SECRET);

    console.log("Login attempt:", { email: data.email, passwordValid });

    // set the token as the cookie value
    setCookie(c, COOKIE_KEY, token, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      sameSite: "lax"
    });
    return c.json({
      "message": `Logged in as user with id ${user.id}`,
    });
  } else {
    return c.json({
      "message": "Invalid password!",
    });
  }

});

// for the registration
app.post("/api/auth/register", async (c) => {
  const data = await c.req.json();

  const result = await sql`INSERT INTO users (email, password_hash)
    VALUES (${data.email.trim().toLowerCase()},
    ${hash(data.password.trim())}) RETURNING *`;
  return c.json({ "message": `Registered as user ${result[0].id}.` });
});


app.post("/api/auth/verify", async (c) => {
  const token = getCookie(c, COOKIE_KEY);
  if (!token) {
    c.status(401);
    return c.json({
      "message": "No token found!",
    });
  }

  try {
    const payload = await jwt.verify(token, JWT_SECRET);
    payload.exp = Math.floor(Date.now() / 1000) + 60;

    const refreshedToken = await jwt.sign(payload, JWT_SECRET);

    setCookie(c, COOKIE_KEY, refreshedToken, {
      path: "/",
      domain: "localhost",
      httpOnly: true,
      sameSite: "lax",
    });

    return c.json({
      "message": "Valid token!",
    });
  } catch (e) {
    c.status(401);
    return c.json({
      "message": "Invalid token!",
    });
  }
});

export default app;