import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetUserAlertsData } from '../services/AlertService';

export async function handler(event: APIGatewayEvent, context: Context) {

    const data = await GetUserAlertsData();
    
    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}