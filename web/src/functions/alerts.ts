import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, GetUserAlertsData } from '../services/AlertService';

Connect().then(() => console.log("AlertService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
  context.callbackWaitsForEmptyEventLoop = false;

  const data = await GetUserAlertsData();
  
  return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Cache-Control': 'public, max-age=1800',
      },
  }
}