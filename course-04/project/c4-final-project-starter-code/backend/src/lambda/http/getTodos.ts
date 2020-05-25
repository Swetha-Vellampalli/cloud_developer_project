import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import 'source-map-support/register';

import { getAllTodos } from '../../service/todoService';

 const getHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];
    console.log("items are being retrieved");

    const todos = await getAllTodos(jwtToken);

    return {
        statusCode: 200,
        body: JSON.stringify({
            items: todos,
        }),
    };
};

export const handler = middy(getHandler)
                        .use(cors({ credentials: true }));