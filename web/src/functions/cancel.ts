import { Context, APIGatewayEvent } from 'aws-lambda'
import { UpdateUserAlert } from '../services/AlertService';

export async function handler(event: APIGatewayEvent, context: Context) {
    const data = event.queryStringParameters;
    console.log(data);
    
    if (!data.email || !data.id)
        return { statusCode: 400, body: "Bad Request" };

    const result = await UpdateUserAlert(data.id, { disabled: true });
    if (!result) return { statusCode: 500, body: "Error updating user" };

    return {
        statusCode: 200,
        body: `Ok. Email removed`
    }
}