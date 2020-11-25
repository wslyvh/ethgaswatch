import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect as AlertConnect, GetUserAlerts, UpdateUserAlert } from '../services/AlertService';
import { SendEmailNotification } from '../services/EmailService';
import { Connect as GasConnect, GetLatestGasData } from '../services/GasService';
import { RegisteredEmailAddress } from '../types';

AlertConnect().then(() => console.log("AlertService Connected"));
GasConnect().then(() => console.log("GasService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {    
    context.callbackWaitsForEmptyEventLoop = false;

    const data = await GetLatestGasData();
    const normal = data.normal.gwei;
    console.log("Current avg normal", normal);

    const activeUsers = await GetUserAlerts("Active", normal);
    const uniques = activeUsers.filter((item: RegisteredEmailAddress, index: number, array: RegisteredEmailAddress[]) => 
        array.findIndex(i => i.email === item.email) === index);

    uniques.map(async i => {
        console.log("Notifying user", i.email, i._id.toString());
        await SendEmailNotification(i.email, i._id.toString(), i.price, normal);
        await UpdateUserAlert(i._id.toString(), { emailSent: true });
    });

    const flaggedUsers = await GetUserAlerts("Flagged", normal);
    flaggedUsers.map(async i => {
        const result = await UpdateUserAlert(i._id.toString(), { emailSent: false });
        console.log("Unflagged user", i.email, result);
    });

    return { statusCode: 200, body: `Ok. ${uniques.length} notifications sent. ${flaggedUsers.length} unflagged.` }
}