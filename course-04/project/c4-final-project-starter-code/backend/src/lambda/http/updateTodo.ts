import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { updateTodo } from '../../service/todoService';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodoHandler');

const updateTodoHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
     logger.info("item id being updated ", todoId);

    await updateTodo(todoId, updatedTodo, jwtToken);

    return {
        statusCode: 204,
        body: '',
    };
};

export const handler = middy(updateTodoHandler).use(
    cors({ credentials: true }),
);