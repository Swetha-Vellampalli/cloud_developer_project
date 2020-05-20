import 'source-map-support/register'
import * as uuid from 'uuid';

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { cors } from 'middy/middlewares';
import * as middy from 'middy';
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { TodoDao } from '../../dao/TodoDao';
import { parseUserId } from '../../auth/utils';
import { TodoItem } from '../../models/TodoItem';

const todoDao = new TodoDao();

 const createHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const newItem = await createTodo(newTodo, jwtToken);
    return {
        statusCode: 201,
        body: JSON.stringify({
            newItem,
        }),
    };
};

async function createTodo(
    createTodoRequest: CreateTodoRequest,
    jwtToken: string,
): Promise<TodoItem> {
    const itemId = uuid.v4();
    const userId = parseUserId(jwtToken);

    return todoDao.createTodo({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: new Date().toISOString(),
        done: false,
    });
}

export const handler = middy(createHandler).use(
    cors({ credentials: true }),
);