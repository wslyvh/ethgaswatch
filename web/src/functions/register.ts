import { Context, APIGatewayEvent } from 'aws-lambda'
import { RegisterUser } from '../services/AirtableService';
import { SendConfirmationEmail } from '../services/EmailService';

export async function handler(event: APIGatewayEvent, context: Context) {
    if (event.httpMethod !== "POST")
        return { statusCode: 405, body: "Method Not Allowed" };

    const data = JSON.parse(event.body);
    if (!data.email || !data.gasprice)
        return { statusCode: 400, body: "Bad Request" };

    const id = await RegisterUser(data.email, data.gasprice);
    await SendConfirmationEmail(data.email, id);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `${data.email} registered.`,
            data,
        })
    }
}