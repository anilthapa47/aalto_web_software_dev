import { Hono } from "@hono/hono";
import postgres from "postgres";

const BANNED_WORDS = [
  "delete", "update", "insert", "drop", "alter", "create",
  "truncate", "replace", "merge", "grant", "revoke",
  "transaction", "commit", "rollback", "savepoint", "lock",
  "execute", "call", "do", "set", "comment"
];

const app = new Hono();

const sql = postgres();




app.get("/api/courses", async (c) => {
  try {
    const courses = await sql`SELECT id, name FROM courses`;
    // Return as JSON
    return c.json(courses, 200);
  } catch (err) {
    // Handle errors
    return c.json({ error: err.message }, 500);
  }
});

app.get("/api/courses/:id", async (c) => {
  try {
    const id = await c.req.param("id");

    // query the database
    const course = await sql`SELECT id, name FROM courses WHERE id = ${id}`;
    if (course.length === 0) {
      return c.json({ error: "Course not found" }, 404);
    }
    // Return as JSON
    return c.json(course[0], 200);
  } catch (err) {
    // Handle errors
    return c.json({ error: err.message }, 500);
  }
});

app.post("/api/courses", async (c) => {
  try {
    const body = await c.req.json();      // get JSON body
    const { name } = body;

    if (!name || name.length < 3) {
      return c.json({ error: "Course name is required" }, 400);
    }

    // Insert into the database and return the new row
    const [newCourse] = await sql`
      INSERT INTO courses (name)
      VALUES (${name})
      RETURNING id, name
    `;

    return c.json(newCourse, 201); // 201 Created

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete("/api/courses/:id", async (c) => {
  try {
    const id = c.req.param("id");

    // Delete the course and return the deleted row
    const [deletedCourse] = await sql`
      DELETE FROM courses
      WHERE id = ${id}
      RETURNING id, name
    `;

    if (!deletedCourse) {
      return c.json({ error: "Course not found" }, 404);
    }

    return c.json(deletedCourse, 200);

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

// for the question database.
app.get("/api/courses/:id/questions", async (c) => {
  try {
    const courseId = c.req.param("id"); // get course ID from path

    // Query the database for questions associated with this course
    const questions = await sql`
      SELECT id, title, text, upvotes, course_id
      FROM questions
      WHERE course_id = ${courseId}
      ORDER BY id
    `;

    // Return questions as JSON
    return c.json(questions, 200);

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.post("/api/courses/:id/questions", async (c) => {
  try {
    const courseId = c.req.param("id");       // get the course ID from the path
    const body = await c.req.json();          // get the JSON body
    const { title, text } = body;

    // Basic validation
    if (!title || title.length < 3 || !text || text.length < 3) {
      return c.json({ error: "Title and text are required" }, 400);
    }

    // Insert the new question into the database
    const [newQuestion] = await sql`
      INSERT INTO questions (title, text, upvotes, course_id)
      VALUES (${title}, ${text}, 0, ${courseId})
      RETURNING id, title, text, upvotes, course_id
    `;

    // Return the newly created question
    return c.json(newQuestion, 201);

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});


app.post("/api/courses/:id/questions/:qId/upvote", async (c) => {
  try {
    const courseId = c.req.param("id");  // course ID
    const questionId = c.req.param("qId"); // question ID

    // Update the question's upvotes by 1 and return the updated row
    const [updatedQuestion] = await sql`
      UPDATE questions
      SET upvotes = upvotes + 1
      WHERE id = ${questionId} AND course_id = ${courseId}
      RETURNING id, title, text, upvotes, course_id
    `;

    if (!updatedQuestion) {
      return c.json({ error: "Question not found" }, 404);
    }

    // Return the updated question
    return c.json(updatedQuestion, 200);

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

app.delete("/api/courses/:id/questions/:qId", async (c) => {
  try {
    const courseId = c.req.param("id");   // course ID
    const questionId = c.req.param("qId"); // question ID

    // Delete the question and return the deleted row
    const [deletedQuestion] = await sql`
      DELETE FROM questions
      WHERE id = ${questionId} AND course_id = ${courseId}
      RETURNING id, title, text, upvotes, course_id
    `;

    if (!deletedQuestion) {
      return c.json({ error: "Question not found" }, 404);
    }

    // Return the deleted question
    return c.json(deletedQuestion, 200);

  } catch (err) {
    return c.json({ error: err.message }, 500);
  }
});

export default app;