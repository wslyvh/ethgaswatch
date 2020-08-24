require('encoding');
import fetch from 'node-fetch';
import { AppConfig } from "../config/app";
import { RegisteredEmailAddress } from '../types';

export async function RegisterUser(email: string, gasprice: string): Promise<string> { 

    const response = await fetch(`https://api.airtable.com/v0/${AppConfig.AIRTABLE_BASEID}/Users`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${AppConfig.AIRTABLE_APIKEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "fields": {
                "Email": email,
                "Price": Number(gasprice)
            }
        }),
    })

    const body = await response.json();
    
    return body.id;
}

export async function UpdateUser(id: string, fields: any): Promise<string> { 

    const response = await fetch(`https://api.airtable.com/v0/${AppConfig.AIRTABLE_BASEID}/Users/${id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${AppConfig.AIRTABLE_APIKEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fields),
    })

    const body = await response.json();
    
    return body.id;
}

export async function GetUsers(gasprice?: number): Promise<RegisteredEmailAddress[]> { 

    let priceFilter = "";
    if (gasprice) { 
        priceFilter = `&filterByFormula=${gasprice}+%3C+%7BPrice%7D`
    }

    const response = await fetch(`https://api.airtable.com/v0/${AppConfig.AIRTABLE_BASEID}/Users?view=Active&fields%5B%5D=Email&fields%5B%5D=Price${priceFilter}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${AppConfig.AIRTABLE_APIKEY}`
        }
    })

    const body = await response.json();
    const users = body.records.map((i: any) => {
        return { 
            id: i.id,
            email: i.fields.Email,
            price: i.fields.Price
        } as RegisteredEmailAddress
    })
    
    return users;
}