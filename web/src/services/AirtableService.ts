require('encoding');
import fetch from 'node-fetch';
import { AppConfig } from "../config/app";

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