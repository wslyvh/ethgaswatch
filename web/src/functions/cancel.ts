import { Context, APIGatewayEvent } from 'aws-lambda'
import { UpdateUser } from '../services/AirtableService';

export async function handler(event: APIGatewayEvent, context: Context) {
    const data = event.queryStringParameters;
    console.log(data);
    
    if (!data.email || !data.id)
        return { statusCode: 400, body: "Bad Request" };

    await UpdateUser(data.id, {
        "fields": {
            "Disabled": true
        }
    })

    return {
        statusCode: 200,
        body: `Ok. Email removed`
    }
}