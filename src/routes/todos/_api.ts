import type { RequestEvent } from "@sveltejs/kit"
import PrismaClient from "$lib/prisma";
// TODO: Persist in database
let todos: Todo[] = [];
const prisma = new PrismaClient();

export const api = async (request: RequestEvent, data?: Record<string, unknown>) => {
  let body = {};
  let status = 500;

  switch (request.request.method.toUpperCase()) {
    case "GET":
      body = await prisma.todo.findMany();
      status = 200;
      break;
    case "POST":
      todos.push(data as Todo);
      body = await prisma.todo.create({
        data: {
          created_at: data.created_at as Date,
          done: data.done as boolean,
          text: data.text as string
        }
      })
      status = 201;
      break;
    case "DELETE":
      body = await prisma.todo.delete({
        where: {
          uid: request.params.uid
        }
      })
      status = 200;
      break;
    case "PATCH":
      todos = todos.map((todo) => {
        if (todo.uid === request.params.uid) {
          if (data.text) todo.text = data.text as string;
            else todo.done = data.done as boolean;
        }
        return todo;
      })
      status = 200;
      body = await prisma.todo.update({
        where: {
          uid: request.params.uid
        },
        data: {
          done: data.done,
          text: data.text != null ? data.text : undefined
        }
      })
      status = 200;
      break;
    default:
      break;
  }

  if (request.request.method.toUpperCase() !== "GET" 
      && request.request.headers.get("accept") !== "application/json") 
    {
    return {
      status: 303,
      headers: {
        location: "/"
      }
    };
  }

  return {
    status,
    body
  }
} 