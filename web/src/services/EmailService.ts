import { AppConfig } from "../config/app";

const sendgridMailer = require('@sendgrid/mail');

export async function SendConfirmationEmail(email: string, id: string) : Promise<void> { 
    sendgridMailer.setApiKey(AppConfig.SENDGRID_APIKEY);
    const activationLink = `${AppConfig.HOST}.netlify/functions/confirm?email=${email}&id=${id}`
    const message = {
        to: email,
        from: {
            email: 'notifier@ethgas.watch',
            name: 'ETH Gas.watch notifier'
        },
        subject: 'Confirm Registration',
        text: 
            `To complete your registration process for ETH Gas.watch notification emails, please confirm you received this email. 
            To do so, click the link below.
            ${activationLink}`
    };

    sendgridMailer.send(message);
}