import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { TodoDao } from '../../dao/TodoDao';
import { parseUserId } from '../../auth/utils';

 const todoDao = new TodoDao();
const updateTodoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    await updateTodo(todoId, updatedTodo, jwtToken);

    return {
        statusCode: 204,
        body: '',
    };
};
async function updateTodo(
    todoId: string,
    updateTodoRequest: UpdateTodoRequest,
    jwtToken: string,
): Promise<void> {
    const userId = parseUserId(jwtToken);
    const todo = await todoDao.getTodo(todoId, userId);

    todoDao.updateTodo(todo.todoId, todo.createdAt, updateTodoRequest);
}
export const handler = middy(updateTodoHandler).use(
    cors({ credentials: true }),
);