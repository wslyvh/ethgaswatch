import { BotConfig } from "./config/botconfig"
import { registerHandlers } from "./handlers";
import { Context } from "telegraf";
import Telegraf from "telegraf";

export async function launch() { 
    console.log("INIT BOT");
    const bot = new Telegraf(BotConfig.TELEGRAM_APIKEY)

    console.log("REGISTER HANDLERS");
    await registerHandlers(bot);

    bot.catch((err: any, ctx: Context) => {
        console.log(`Unhandled error occured for ${ctx.updateType}`, err);
    });

    console.log("TAKEOFF");
    bot.launch()
}