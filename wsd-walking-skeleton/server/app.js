import { Hono } from "@hono/hono";
import { cors } from "@hono/hono/cors";
import { logger } from "@hono/hono/logger";
//import postgres from "postgres";

const app = new Hono();




app.get("/", (c) => c.json({ message: "Hello world!" }));

/*
const todos = await sql`SELECT * FROM todos`;
return c.json(todos);
*/
// GET /courses returns a JSON document that looks as follows: '{"courses": [ {"id": 1, "name": "Web Software Development" }, {"id": 2, "name": "Device-Agnostic Design" } ] }'.
app.get("/courses", async (c) => {
  return c.json({
    courses: [
      { id: 1, name: "Web Software Development" },
      { id: 2, name: "Device-Agnostic Design" }
    ]
  });

  /*
  GET /courses/:id, where ':id' is a path variable, returns a JSON document that looks as follows: '{"course": {"id": :id, "name": "Course Name" } }', 
  where ':id' is retrieved from the path. The name is a string (just "Course Name", not e.g. "Web Software Development", while the id is a number).
  */


});

/*
GET /courses/:id, where ':id' is a path variable, 
returns a JSON document that looks as follows: '{"course": {"id": :id, "name": "Course Name" } }', where ':id' is retrieved from the path. The name is a string (just "Course Name", not e.g. "Web Software Development", while the id is a number).
*/
app.get("/courses/:id", async (c) => {
  const rawId = Number(c.req.param("id"));
  const id = Number(rawId);
  return c.json({
    course: 
      { id: id, name: "Course Name" }
  });
});

// POST /courses receives a JSON document that looks as follows: '{"name": "Course Name" }', where 'name' is a string. It returns a JSON document that looks as follows: '{"course": {"id": 3, "name": "Course Name" } }', where 'id' is a number.
app.post("/courses", async (c) => {
  const { name } = await c.req.json();
  return c.json({
    course: {
      id: 3,
      name: name
    }
  });
});


// GET /courses/:id/topics, where ':id' is a path variable, returns a JSON document that looks as follows: '{"topics": [ { "id": 1, "name": "Topic 1" }, {"id": 2, "name": "Topic 2" } ] }'. Nothing is done with the path variable.

export default app;
app.get("/courses/:id/topics", async (c) => {
  return c.json({
    topics: [
      { id: 1, name: "Topic 1" },
      { id: 2, name: "Topic 2" }
    ]
  });
});

//GET /courses/:cId/topics/:tId/posts, where ':cId' and ':tId' are path variables, returns a JSON document that looks as follows: '{"posts": [ {"id": 1, "title": "Post 1" }, {"id": 2, "title": "Post 2" } ] }'. Nothing is done with the path variables.

app.get("/courses/:cId/topics/:tId/posts", async (c) => {
  return c.json({
    posts: [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" }
    ]
  });
});

// GET /courses/:cId/topics/:tId/posts/:pId, where ':cId', ':tId', and ':pId' are path variables, returns a JSON document that looks as follows: '{"post": {"id": :pId, "title": "Post Title" }, "answers": [ { "id": 1, "content": "Answer 1" }, {"id": 2, "content": "Answer 2" } ] }'. The path variables :cId and :tId are not used.

app.get("/courses/:cId/topics/:tId/posts/:pId", async (c) => {
  const rawpId = c.req.param("pId");
  const pId = Number(rawpId);
  return c.json({
    post: {
      id: pId,
      title: "Post Title"
    },
    answers: [
      { id: 1, content: "Answer 1" },
      { id: 2, content: "Answer 2" }
    ]
  });
});