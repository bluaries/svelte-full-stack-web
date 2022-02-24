import type { RequestHandler } from "@sveltejs/kit";
    
// TODO: Persist in database
let todos: Todo[] = [];

export const get: RequestHandler = () => {
  return {
    status: 200,
    body: todos
  }
}

export const post: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    
    todos.push({
      created_at: new Date(),
      text: formData.get('text') as string,
      done: false 
    });

    return {
      // redirect after submitting a form
      status: 303, 
      headers: {
      location: "/"
      }
    }
}
