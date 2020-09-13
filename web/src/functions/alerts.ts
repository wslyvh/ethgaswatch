import { Context, APIGatewayEvent } from 'aws-lambda'
import { AlertsData  } from '../types';

export async function handler(event: APIGatewayEvent, context: Context) {

    const data = {
        alerts: 900,
        unique: 600,
        average: 120,
        mode: 100,
    } as AlertsData; 

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}