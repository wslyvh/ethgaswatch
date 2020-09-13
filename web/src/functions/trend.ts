import { Context, APIGatewayEvent } from 'aws-lambda'
import { TrendChartData } from '../types';
import moment from 'moment';

export async function handler(event: APIGatewayEvent, context: Context) {
    const qs = event.queryStringParameters;

    let labels = [];
    let slow = [];
    let normal = [];
    let fast = [];
    let instant = [];

    const days = parseInt(qs.days);
    if (!isNaN(days)) { 
        labels = [...new Array(days)].map((i, idx) => moment().startOf("day").subtract(idx, "days").format('ll'));
        for (let index = 0; index < days; index++) {
            const slowNr = getRandomNumber(50, 200);
            
            slow.push(slowNr);
            normal.push(slowNr + getRandomNumber(1, 5));
            fast.push(slowNr + getRandomNumber(8, 12));
            instant.push(slowNr + getRandomNumber(15, 30));
        }
    } 

    const hours = parseInt(qs.hours);
    if (!isNaN(hours)) { 
        // 
    }

    const data = {
        labels,
        slow,
        normal,
        fast,
        instant
    } as TrendChartData

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }