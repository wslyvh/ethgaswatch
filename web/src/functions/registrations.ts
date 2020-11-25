import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, GetDailyUserAlertsRegistrations } from '../services/AlertService';

Connect().then(() => console.log("AlertService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
    context.callbackWaitsForEmptyEventLoop = false;
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