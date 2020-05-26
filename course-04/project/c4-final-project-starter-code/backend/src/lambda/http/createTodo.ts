import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import 'source-map-support/register'
import * as uuid from 'uuid'
import { parseUserId } from '../../auth/utils'
 import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import { createLogger } from '../../utils/logger';

const docClient = new AWS.DynamoDB.DocumentClient()

const todosTable = process.env.TODOS_TABLE
const logger = createLogger('createHandler');

export const createHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info("EVENT:", event);

    const todoId = uuid.v4()

    const parsedBody: CreateTodoRequest = JSON.parse(event.body)

    const authHeader = event.headers.Authorization
    const authSplit = authHeader.split(" ")
    const token = authSplit[1]

    logger.info("test",token)

    const item = {
      todoId: todoId,
        userId: parseUserId(token),
       name: parsedBody.name,
      dueDate: parsedBody.dueDate,
     createdAt: new Date().toISOString(),
      done: false,
    }

    await docClient.put({
        TableName: todosTable,
        Item: item
    }).promise()

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          item
        })
    }
}


 export const handler = middy(createHandler).use(
    cors({ credentials: true }),
);