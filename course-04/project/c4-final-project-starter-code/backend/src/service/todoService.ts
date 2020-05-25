import { TodoItem } from '../models/TodoItem';
import { TodoDao } from '../dao/TodoDao';
import { parseUserId } from '../auth/utils';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

const todoDao = new TodoDao();

export async function deleteTodo(
     todoId: string,
     jwtToken: string,
 ): Promise<void> {
     const userId = parseUserId(jwtToken);
     const todo = await todoDao.getTodo(todoId, userId);

     todoDao.deleteTodo(todo.todoId, todo.createdAt);
 }

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);

    return todoDao.getAllTodos(userId);
}

export async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await todoDao.getTodo(todoId, userId);

    todoDao.updateTodo(todo.todoId, todo.createdAt, updateTodoRequest);
}

export async function setAttachmentUrl(
    todoId: string,
    attachmentUrl: string,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await todoDao.getTodo(todoId, userId);

    todoDao.setAttachmentUrl(todo.todoId, todo.createdAt, attachmentUrl);
}