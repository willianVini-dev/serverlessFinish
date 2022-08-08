import {APIGatewayProxyHandler} from 'aws-lambda';
import { document } from '../utils/dynamodbClient'

interface ICreateUser {
  deadline: string;
  title: string;
}
export const handler:APIGatewayProxyHandler = async (event)=>{

  const { title, deadline } = JSON.parse(event.body) as ICreateUser

  const {userid} = event.pathParameters

  await document.put({
    TableName: 'users_serverless',
    Item: {
      id: '12345', 
      user_id:userid, 
      title,
      done: false, 
      deadline
    }
  }).promise();

  return {
    statusCode: 201,
    body:JSON.stringify({
      message: 'user created success',
      user: userid,
      title
    })
  }

}