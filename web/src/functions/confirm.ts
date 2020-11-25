import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, UpdateUserAlert } from '../services/AlertService';

Connect().then(() => console.log("AlertService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
    context.callbackWaitsForEmptyEventLoop = false;
    const data = event.queryStringParameters;
    console.log(data);
    
    if (!data.email || !data.id)
        return { statusCode: 400, body: "Bad Request" };

    const result = await UpdateUserAlert(data.id, { confirmed: true });
    if (!result) return { statusCode: 500, body: "Error updating user" };

    return {
        statusCode: 200,
        body: `Ok. Email confirmed`
    }
}