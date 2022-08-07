import {APIGatewayProxyHandler} from 'aws-lambda';
import { document } from '../utils/dynamodbClient'

export const handler:APIGatewayProxyHandler = async (event)=>{

  const { title, deadline } = JSON.parse(event.body)
  const {user_id} = event.pathParameters

  await document.put({
    TableName: 'user_serverless',
    Item: {
      id: '12345', // id gerado para garantir um único todo com o mesmo id
      user_id, // id do usuário recebido no pathParameters
      title,
      done: false, // inicie sempre como false
      deadline
    }
  }).promise();

  return {
    statusCode: 201,
    body:JSON.stringify({
      message: 'user created success',
      user: user_id
    })
  }

}