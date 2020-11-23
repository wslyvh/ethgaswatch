import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetDailyUserAlertsRegistrations } from '../services/AlertService';

export async function handler(event: APIGatewayEvent, context: Context) {
    const qs = event.queryStringParameters;

    let data: any = null;
    const days = parseInt(qs.days);
    if (!isNaN(days)) { 
        data = await GetDailyUserAlertsRegistrations(days);
    } 

    if (isNaN(days))
        return { statusCode: 400, body: "Bad Request" };

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}