import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, RegisterUserAlert } from '../services/AlertService';
import { SendConfirmationEmail } from '../services/MailjetService';

Connect().then(() => console.log("AlertService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Ok',
            data: '',
        })
    }
    context.callbackWaitsForEmptyEventLoop = false;
    
    if (event.httpMethod !== "POST")
        return { statusCode: 405, body: "Method Not Allowed" };

    const data = JSON.parse(event.body);
    if (!data.email || !data.gasprice)
        return { statusCode: 400, body: "Bad Request" };

    const id = await RegisterUserAlert(data.email, data.gasprice);
    if (!id) return { statusCode: 500, body: "Error registering user" };
    
    await SendConfirmationEmail(data.email, id);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `${data.email} registered.`,
            data,
        })
    }
}