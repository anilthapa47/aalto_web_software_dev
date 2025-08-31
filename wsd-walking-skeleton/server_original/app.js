import { Hono } from "jsr:@hono/hono@4.6.5";
import { getCookie, setCookie } from "jsr:@hono/hono@4.6.5/cookie";
import { cors } from "jsr:@hono/hono@4.6.5/cors";
import { hash, verify } from "jsr:@denorg/scrypt@4.4.4";
import * as jwt from "jsr:@hono/hono@4.6.5/jwt";
import postgres from "postgres";

const sql = postgres(); // DB credentials from environment

const app = new Hono();

const COOKIE_KEY = "token";
const JWT_SECRET = "wsd-project-secret";

// Enable CORS with credentials
app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Helper: normalize input
const clean = (data) => {
  if (data.email) data.email = data.email.trim().toLowerCase();
  if (data.password) data.password = data.password.trim();
};

// --------------------
// POST /api/auth/register
// --------------------
app.post("/api/auth/register", async (c) => {
  const data = await c.req.json();
  clean(data);

  const result = await sql`
    INSERT INTO users (email, password_hash)
    VALUES (${data.email}, ${hash(data.password)})
    RETURNING id
  `;

  return c.json({ message: `Registered as user ${result[0].id}` });
});

// --------------------
// POST /api/auth/login
// --------------------
app.post("/api/auth/login", async (c) => {
  const data = await c.req.json();
  clean(data);

  const result = await sql`SELECT * FROM users WHERE lower(email) = ${data.email}`;

  if (result.length === 0) {
    return c.json({ message: "Incorrect email or password." });
  }

  const user = result[0];

  if (!verify(data.password, user.password_hash)) {
    return c.json({ message: "Incorrect email or password." });
  }

  // Create JWT payload
  const payload = { email: user.email };
  const token = await jwt.sign(payload, JWT_SECRET);

  // Set cookie
  setCookie(c, COOKIE_KEY, token, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  });

  return c.json({ message: "Welcome!" });
});

// --------------------
// JWT Middleware
// --------------------
const jwtMiddleware = async (c, next) => {
  try {
    const token = getCookie(c, COOKIE_KEY);
    if (!token) throw new Error("No token");

    const payload = await jwt.verify(token, JWT_SECRET);
    c.set("jwt-payload", payload);
    await next();
  } catch {
    return c.text("Unauthorized", 401);
  }
};

// --------------------
// Example protected endpoint
// --------------------
app.get("/api/auth/me", jwtMiddleware, async (c) => {
  return c.json(c.get("jwt-payload"));
});

export default app;
