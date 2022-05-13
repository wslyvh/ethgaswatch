import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, GetLatestGasData } from '../services/GasService';
import { GasPriceData } from '../types';

Connect().then(() => console.log("GasService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const data = await GetLatestGasData();

  return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Cache-Control': 'public, max-age=300',
      }
  }
}