import { Context, APIGatewayEvent } from 'aws-lambda'

export async function handler(event: APIGatewayEvent, context: Context) {
    if (event.httpMethod !== "POST")
        return { statusCode: 405, body: "Method Not Allowed" };

    const data = JSON.parse(event.body);
    if (!data.email || !data.gasprice)
        return { statusCode: 400, body: "Bad Request" };

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Registered",
            data,
        })
    }
}