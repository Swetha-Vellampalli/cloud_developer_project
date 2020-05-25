import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { setAttachmentUrl } from '../../service/todoService';
import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import * as middy from 'middy';
import { cors } from 'middy/middlewares';
import * as uuid from 'uuid';

const XAWS = AWSXRay.captureAWS(AWS);

let options: AWS.S3.Types.ClientConfiguration = {
    signatureVersion: 'v4',
};

const s3 = new XAWS.S3(options);

const bucketName = process.env.IMAGES_S3_BUCKET;
const urlExpiration = parseInt(process.env.SIGNED_URL_EXPIRATION);


function getUploadUrl(imageId: string): string {
     return s3.getSignedUrl('putObject', {
         Bucket: bucketName,
         Key: imageId,
         Expires: urlExpiration,
     });
 }
 const generateUploadUrlHandler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  console.log("todo id", todoId)

  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
 const authorization = event.headers.Authorization;
     const split = authorization.split(' ');
     const jwtToken = split[1];

     const imageId = uuid.v4();
  console.log("imageId id", imageId)

     setAttachmentUrl(
         todoId,
         `https://${bucketName}.s3.amazonaws.com/${imageId}`,
         jwtToken,
     );

     const uploadUrl = getUploadUrl(imageId);

     return {
         statusCode: 201,
         body: JSON.stringify({
             uploadUrl,
         }),
     };
 };

 /* async function setAttachmentUrl(
     todoId: string,
     attachmentUrl: string,
     jwtToken: string,
 ): Promise<void> {
     const userId = parseUserId(jwtToken);
     const todo = await todoDao.getTodo(todoId, userId);

     todoDao.setAttachmentUrl(todo.todoId, todo.createdAt, attachmentUrl);
 }*/
export const handler = middy(generateUploadUrlHandler).use(
    cors({ credentials: true }),
);
