require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetAllPrices } from '../services/GasService';

export async function handler(event: APIGatewayEvent, context: Context) {
    const results = await GetAllPrices();

    return {
        statusCode: 200,
        body: JSON.stringify(results)
    }
}