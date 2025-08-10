import { Hono } from "jsr:@hono/hono@4.6.5";
import { cors } from "jsr:@hono/hono@4.6.5/cors";
const app = new Hono();
app.use('/*', cors());

// Initial courses data
const courses = [
  { id: 1, name: "Web Software Development" },
  { id: 2, name: "Device-Agnostic Design" }
];

// Empty questions list at startup
let questions = [];

// GET /courses - list all courses
app.get('/courses', (c) => {
  return c.json({ courses });
});

// GET /courses/:id - return course with id and fixed name
app.get('/courses/:id', (c) => {
  const id = Number(c.req.param('id'));
  return c.json({ course: { id, name: "Course Name" } });
});

// POST /courses - add a new course with id=3 and given name
app.post('/courses', async (c) => {
  const body = await c.req.json();
  const name = body.name || "Course Name";
  return c.json({ course: { id: 3, name } });
});


//second part of the GET /courses/:id/questions

app.get('/courses/:id/questions', (c) => {
  const id = Number(c.req.param('id'));
  return c.json(questions);
});


// POST /courses/:id/questions - add new question with id = length+1
app.post('/courses/:id/questions', async (c) => {
  const body = await c.req.json();
  const newQuestion = {
    id: questions.length + 1,
    title: body.title,
    text: body.text,
    upvotes: 0
  };
  questions.push(newQuestion);
  return c.json(newQuestion);
});

// POST /courses/:id/questions/:qId/upvote - increment upvotes of question
app.post('/courses/:id/questions/:qId/upvote', (c) => {
  const qId = Number(c.req.param('qId'));
  const question = questions.find(q => q.id === qId);
  if (!question) {
    return c.json({ error: "Question not found" }, 404);
  }
  question.upvotes++;
  return c.json(question);
});

// DELETE /courses/:id/questions/:qId - delete question and return it
app.delete('/courses/:id/questions/:qId', (c) => {
  const qId = Number(c.req.param('qId'));
  const index = questions.findIndex(q => q.id === qId);
  if (index === -1) {
    return c.json({ error: "Question not found" }, 404);
  }
  const removed = questions.splice(index, 1)[0];
  return c.json(removed);
});

export default app;