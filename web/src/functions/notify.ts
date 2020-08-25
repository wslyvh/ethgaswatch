import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetUsers, UpdateUser } from '../services/AirtableService';
import { SendEmailNotification } from '../services/EmailService';
import { GetAveragePrice } from '../services/GasService';
import { RegisteredEmailAddress } from '../types';

export async function handler(event: APIGatewayEvent, context: Context) {
    
    const currentPrice = await GetAveragePrice();
    console.log("Current average low", currentPrice.low);

    const activeUsers = await GetUsers("Active", currentPrice.low);
    const uniques = activeUsers.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
        array.findIndex(i => i.email === item.email) === index);

    await Promise.all(uniques.map(i => {
        SendEmailNotification(i.email, i.id, i.price, currentPrice.low);
        UpdateUser(i.id, {
            "fields": {
                "EmailSent": true
            }
        })
    }));

    const flaggedUsers = await GetUsers("Flagged", currentPrice.low);
    await Promise.all(flaggedUsers.map(i => {
        UpdateUser(i.id, {
            "fields": {
                "EmailSent": false
            }
        })
    }));

    return { statusCode: 200, body: `Ok. ${uniques.length} notifications sent. ${flaggedUsers} unflagged.` }
}