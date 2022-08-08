import {APIGatewayProxyHandler} from 'aws-lambda';
import { document } from '../utils/dynamodbClient'


export const handler:APIGatewayProxyHandler = async (event)=>{

  const { userid } = event.pathParameters
  console.log(userid)

  const response = await document.query({
    TableName: 'users_serverless',
    KeyConditionExpression: 'user_id = :userid',
    ExpressionAttributeValues: {
      ':userid': userid
    }
  }).promise();

  console.log(response)

  const userCertificate = response.Items[0]
  if(userCertificate){
    return {
      statusCode:201,
      body: JSON.stringify({
        userCertificate
      })
    }
  }

  return{
    statusCode: 400,
    body: JSON.stringify({
      message: "usuario não encontrado"
    })
  }

}