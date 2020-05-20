import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { TodoDao } from '../../dao/TodoDao';
import { parseUserId } from '../../auth/utils';

const todoDao = new TodoDao();

 const deleteHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

 const authorization = event.headers.Authorization;
     const split = authorization.split(' ');
     const jwtToken = split[1];

     await deleteTodo(todoId, jwtToken);

     return {
         statusCode: 204,
         body: '',
     };
  };

  async function deleteTodo(
     todoId: string,
     jwtToken: string,
 ): Promise<void> {
     const userId = parseUserId(jwtToken);
     const todo = await todoDao.getTodo(todoId, userId);

     todoDao.deleteTodo(todo.todoId, todo.createdAt);
 }

export const handler = middy(deleteHandler).use(
    cors({ credentials: true }),
);