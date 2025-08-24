import { todos } from "./books.js";

export function load({ params }) {
  return {
    ...params,
    todo: todos.find(todo => todo.id == params.book)
    //foundBook: todos.find(todo => todo.id == Number(params.id))
  };
}