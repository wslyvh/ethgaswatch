import fetch from 'node-fetch';
import { AppConfig } from "../config/app";
import { RegisteredEmailAddress } from '../types';
require('encoding');

export async function GetAllUsersIterative(users: Array<RegisteredEmailAddress>, offset?: string): Promise<RegisteredEmailAddress[]> { 

    let offsetFilter = offset ? `&offset=${offset}` : "";
    const response = await fetch(`https://api.airtable.com/v0/${AppConfig.AIRTABLE_BASEID}/Users?fields%5B%5D=Email&fields%5B%5D=Price&fields%5B%5D=EmailSent&view=Migrate${offsetFilter}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AppConfig.AIRTABLE_APIKEY}`
        }
    })

    const body = await response.json();
    body.records.forEach((i: any) => {
        const user = { 
            email: i.fields.Email,
            price: Number(i.fields.Price),
            confirmed: true,
            emailSent: i.fields.EmailSent || false
        } as RegisteredEmailAddress;

        users.push(user);
    });

    if (body.offset) { 
        console.log("GetAllUsersIterative", body.offset)
        const offsetUsers = await GetAllUsersIterative(users, body.offset);
        users.concat(offsetUsers);
    }

    return users;
}
