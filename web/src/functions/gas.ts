import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetLatestGasData } from '../services/GasService';

export async function handler(event: APIGatewayEvent, context: Context) {

    const data = await GetLatestGasData();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Cache-Control': 'public, max-age=300',
        },
    }
}