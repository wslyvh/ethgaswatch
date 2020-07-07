import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";
import { COMMANDS } from "../utils/const";
import { getGasprices } from "../service/etherscan";

export default async function registerGas(bot: Telegraf<TelegrafContext>) {
    console.log("Gas Command");
    bot.command(COMMANDS.GAS, printGasCommand);
}

async function printGasCommand(ctx: TelegrafContext) {
    const gasPrices = await getGasprices();
    console.log(gasPrices);

    if (!gasPrices) { 
        return ctx.reply("Couldn't retrieve gas prices. Try again later");
    }

    return ctx.replyWithMarkdown(`
Current gas prices

*Safe:* ${gasPrices.safe} Gwei
*Recommended:* ${gasPrices.recommended} Gwei
    `);
}