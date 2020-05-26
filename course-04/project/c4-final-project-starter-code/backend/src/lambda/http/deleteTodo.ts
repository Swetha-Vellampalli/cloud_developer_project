import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { deleteTodo } from '../../service/todoService';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteHandler');

 const deleteHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

 const authorization = event.headers.Authorization;
     const split = authorization.split(' ');
     const jwtToken = split[1];
     logger.info("item id being deleted ", todoId);
     await deleteTodo(todoId, jwtToken);

     return {
         statusCode: 204,
         body: '',
     };
  };

export const handler = middy(deleteHandler).use(
    cors({ credentials: true }),
);