import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, GetLatestGasData } from '../services/GasService';
import { GasPriceData } from '../types';

let gasData: GasPriceData;
Connect().then(() => console.log("GasService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
  context.callbackWaitsForEmptyEventLoop = false;

  if (!gasData) {
    gasData = await GetLatestGasData();
  }

  return {
      statusCode: 200,
      body: JSON.stringify(gasData),
      headers: {
        'Cache-Control': 'public, max-age=300',
      },
  }
}