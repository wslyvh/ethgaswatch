import { Context, APIGatewayEvent } from 'aws-lambda'
import { AppConfig } from '../config/app'

export async function handler(event: APIGatewayEvent, context: Context) {
    console.log("Hello", AppConfig.NODE_ENV);

    return {
        statusCode: 200,
        body: `Hello World!`
    }
}