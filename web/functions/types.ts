import { Context, APIGatewayEvent } from 'aws-lambda'

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
        })
    }

    return response;
}