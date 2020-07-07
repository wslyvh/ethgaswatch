import Telegraf from "telegraf";
import { TelegrafContext } from "telegraf/typings/context";

export default async function init(bot: Telegraf<TelegrafContext>) {
    console.log("Init");
    bot.start(printStart);
    bot.help(printHelp);
}

async function printStart(ctx: TelegrafContext) {
  return ctx.reply("Hello world!");
}

async function printHelp(ctx: TelegrafContext) {
  return ctx.reply("Help menu..");
}