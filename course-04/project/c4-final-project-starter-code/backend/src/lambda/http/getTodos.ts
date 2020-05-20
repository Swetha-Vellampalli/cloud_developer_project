import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import 'source-map-support/register';
import { TodoDao } from '../../dao/TodoDao';
import { parseUserId } from '../../auth/utils';
import { TodoItem } from '../../models/TodoItem';

 const todoDao = new TodoDao();
 const getHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const todos = await getAllTodos(jwtToken);

    return {
        statusCode: 200,
        body: JSON.stringify({
            items: todos,
        }),
    };
};
async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken);

    return todoDao.getAllTodos(userId);
}

export const handler = middy(getHandler)
                        .use(cors({ credentials: true }));