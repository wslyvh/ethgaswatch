require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetSpotPrice } from '../services/PriceService';

export async function handler(event: APIGatewayEvent, context: Context) {
    const result = await GetSpotPrice();

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    }
}