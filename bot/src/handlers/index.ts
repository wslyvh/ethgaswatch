import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import init from "./init";
import registerGas from "./gas";

export async function registerHandlers(bot: Telegraf<TelegrafContext>): Promise<Telegraf<TelegrafContext>> {
    await init(bot);
    await registerGas(bot);
    
    return bot;
}