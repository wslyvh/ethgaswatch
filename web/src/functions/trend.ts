import { Context, APIGatewayEvent } from 'aws-lambda'
import { TrendChartData } from '../types';
import { GetDailyAverageGasData, GetHourlyAverageGasData } from '../services/GasService';

export async function handler(event: APIGatewayEvent, context: Context) {
    const qs = event.queryStringParameters;

    let data: TrendChartData = null;

    const days = parseInt(qs.days);
    if (!isNaN(days)) { 
        data = await GetDailyAverageGasData(days);
    } 

    const hours = parseInt(qs.hours);
    if (!isNaN(hours)) { 
        data = await GetHourlyAverageGasData(hours);
    }

    if (isNaN(days) && isNaN(hours))
        return { statusCode: 400, body: "Bad Request" };

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
    }
}