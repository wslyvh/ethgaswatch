import { Context, APIGatewayEvent } from 'aws-lambda'
import * as dotenv from "dotenv";

dotenv.config();

interface HelloResponse {
    statusCode: number
    body: string
}

export async function handler(event: APIGatewayEvent, context: Context) {
    const params = event.queryStringParameters
    const response: HelloResponse = {
        statusCode: 200,
        body: JSON.stringify({
            msg: `Hello TypeScript function`,
            params,
            env: process.env.TEST_VAR
        })
    }

    return response;
}