import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetUsers } from '../services/AirtableService';
import { SendEmailNotification } from '../services/EmailService';
import { GetAveragePrice } from '../services/GasService';
import { RegisteredEmailAddress } from '../types';

export async function handler(event: APIGatewayEvent, context: Context) {
    
    const currentPrice = await GetAveragePrice();
    const results = await GetUsers(currentPrice.low);
    const uniques = results.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
        array.findIndex(i => i.email === item.email) === index);

    await Promise.all(uniques.map(i => SendEmailNotification(i.email, i.id, i.price, currentPrice.low)));

    return { statusCode: 200, body: `Ok. ${uniques.length} notifications sent` }
}