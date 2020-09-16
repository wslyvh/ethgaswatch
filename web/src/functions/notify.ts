import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetUsers, UpdateUser } from '../services/AirtableService';
import { SendEmailNotification } from '../services/EmailService';
import { GetLatestGasData } from '../services/GasService';
import { RegisteredEmailAddress } from '../types';

export async function handler(event: APIGatewayEvent, context: Context) {
    
    const data = await GetLatestGasData();
    const normal = data.normal.gwei;
    console.log("Current avg normal", normal);

    const activeUsers = await GetUsers("Active", normal);
    const uniques = activeUsers.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
        array.findIndex(i => i.email === item.email) === index);

    await Promise.all(uniques.map(i => {
        console.log("Notifying user", i.email);
        SendEmailNotification(i.email, i.id, i.price, normal);
        UpdateUser(i.id, {
            "fields": {
                "EmailSent": true
            }
        })
    }));

    const flaggedUsers = await GetUsers("Flagged", normal);
    await Promise.all(flaggedUsers.map(i => {
        console.log("Unflag user", i.email);
        UpdateUser(i.id, {
            "fields": {
                "EmailSent": false
            }
        })
    }));

    return { statusCode: 200, body: `Ok. ${uniques.length} notifications sent. ${flaggedUsers} unflagged.` }
}