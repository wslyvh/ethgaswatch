import { Context, APIGatewayEvent } from 'aws-lambda'

export async function handler(event: APIGatewayEvent, context: Context) {
    
    const res = await fetch(`https://www.gasnow.org/api/v1/gas/price`);
    const body = await res.json();

    return { statusCode: 200, body: body }
}