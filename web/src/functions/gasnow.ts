require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch';

export async function handler(event: APIGatewayEvent, context: Context) {
    
    const res = await fetch(`https://www.gasnow.org/api/v1/gas/price`);
    const body = await res.json();
    console.log(body);

    return { statusCode: 200, body: JSON.stringify(body) }
}