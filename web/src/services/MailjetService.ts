import { AppConfig } from "../config/app";
import fetch from 'node-fetch';
require('encoding');
let base64 = require('base-64');

export async function SendConfirmationEmail(email: string, id: string) : Promise<void> { 
    const activationLink = `${AppConfig.HOST}.netlify/functions/confirm?email=${email}&id=${id}`
    const body = `To confirm your registration for ETH Gas.watch notifications, please click on the link below. 
    
    ${activationLink}`

    const message = {
        "Messages": [
            {
            "From": {
                "Email": "notifier@ethgas.watch",
                "Name": "ETH Gas.watch notifier"
            },
            "To": [
                {
                "Email": email,
                "Name": email
                }
            ],
            "Subject": "Confirm ETH Gas.watch registration",
            "TextPart": body,
            "HTMLPart": body,
            }
        ]
    }

    try {
        const response = await fetch(`https://api.mailjet.com/v3.1/send`, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(AppConfig.MAILJET_APIKEY + ":" + AppConfig.MAILJET_PASSWORD)
            }
        });

        await response.json();
    } catch (ex) { 
        console.log("Error sending confirmation email", ex)
    }
}


// * Want to learn more about Web3? Check out <a href='https://www.useweb3.xyz/?utm_source=ethgas&utm_medium=email'>https://www.useweb3.xyz/</a>.<br/>
// A curated overview of the best and latest resources on Ethereum, blockchain and Web3 development.`

export async function SendEmailNotification(email: string, id: string, price: number, currentPrice: number) : Promise<void> { 
    const cancellationLink = `${AppConfig.HOST}.netlify/functions/cancel?email=${email}&id=${id}`
    const body = `The Ethereum gas price is currently ${currentPrice} gwei. 
    
    For up-to-date prices, check out ${AppConfig.HOST}
    
    To unsubscribe from notifications at this price level, click the link below.
    ${cancellationLink}`

    const htmlBody = `The Ethereum gas price is currently ${currentPrice} gwei. 
    <br/><br/>

    For up-to-date prices, check out <a href='${AppConfig.HOST}'>${AppConfig.HOST}</a>.
    <br/><br/>

    Click <a href='${cancellationLink}'>here</a> to unsubscribe from notifications at this price level.    
    <br/><br/><br/>

    * If you're using this service, please considering donating in <a href='https://gitcoin.co/grants/4143/wslyvh-useweb3-ethgas-tokenlog-more'>Gitcoin Round 12</a>.<br/>
    All your donations are matched using quadratic funding and help keep this service running (for free).<br/><br/>
    Thank you!`

    const message = {
        "Messages": [
            {
            "From": {
                "Email": "notifier@ethgas.watch",
                "Name": "ETH Gas.watch notifier"
            },
            "To": [
                {
                "Email": email,
                "Name": email
                }
            ],
            "Subject": `ETH Gas.price <${price} gwei`,
            "TextPart": body,
            "HTMLPart": htmlBody,
            }
        ]
    }
    
    try {
        const response = await fetch(`https://api.mailjet.com/v3.1/send`, {
            method: 'POST',
            body: JSON.stringify(message),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + base64.encode(AppConfig.MAILJET_APIKEY + ":" + AppConfig.MAILJET_PASSWORD)
            }
        });

        await response.json();
    } catch (ex) { 
        console.log("Error sending notification email", ex)
    }
}
