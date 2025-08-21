import postgres from "postgres";

const sql = postgres();
export const create = async (todo) => {
  const result = await sql`
    INSERT INTO todos (name, done)
    VALUES (${todo.name}, ${todo.done})
    RETURNING *;
  `;
  return result[0];
};

export const getAll = async () => {
  return await sql`SELECT * FROM todos;`;
};

export const getById = async (id) => {
  const result = await sql`
    SELECT * FROM todos WHERE id = ${id};
  `;
  return result[0];
};

export const updateById = async (id, todo) => {
  const result = await sql`
    UPDATE todos SET name = ${todo.name}, done = ${todo.done}
    WHERE id = ${id}
    RETURNING *;
  `;
  return result[0];
};

export const deleteById = async (id) => {
  const result = await sql`
    DELETE FROM todos WHERE id = ${id}
    RETURNING *;
  `;
  return result[0];
};