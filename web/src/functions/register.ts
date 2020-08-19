require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import fetch from 'node-fetch';
import { AppConfig } from '../config/app'

export async function handler(event: APIGatewayEvent, context: Context) {
    if (event.httpMethod !== "POST")
        return { statusCode: 405, body: "Method Not Allowed" };

    const data = JSON.parse(event.body);
    if (!data.email || !data.gasprice)
        return { statusCode: 400, body: "Bad Request" };

    const response = await fetch(`https://api.airtable.com/v0/${AppConfig.AIRTABLE_BASEID}/Users`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AppConfig.AIRTABLE_APIKEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "fields": {
                "Email": data.email,
                "Price": Number(data.gasprice),
                "Confirmed": true
            }
        }),
    })

    const body = await response.json();
    console.log(body);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: `${data.email} registered.`,
            data,
        })
    }
}