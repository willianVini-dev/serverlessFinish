import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'serverlessproject',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-dynamodb-local','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  // import the function via paths
  functions: {
    userInsert:{
      handler: 'src/functions/userInsert.handler',
      events: [
        {
          http:{
            path: "userInsert/{user_id}",
            method: 'post',
            cors: true
            
          }
        }
      ]
    },
   },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
      external:['chrome-aws-lambda']
    },
    dynamodb:{
      stages:[
        'dev', 'local'
      ],
      start:{
        port: 8000,
        inMemory: true,
        migrate: true,
      }
    }
  },
  resources:{
    Resources:{
      dbCertificateUsers:{
        Type: 'AWS::DynamoDB::Table',
        Properties:{
          TableName: 'users_serverless',
          ProvisionedThroughput:{
            ReadCapacityUnits: 5,
            WriteCapacityUnits: 5
          },
          AttributeDefinitions:[
            {
              AttributeName: "id", // name attr
              AttributeType: "S", // type attr String
            }
          ],
          KeySchema:[
            {
              AttributeName: 'id',
              KeyType: 'HASH'
            }
          ]
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
