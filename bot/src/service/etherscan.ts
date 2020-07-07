import { BotConfig } from "../config/botconfig";
import { GasPrices } from "../models/gasPrices";
const fetch = require("node-fetch");

export async function getGasprices() { 
    const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${BotConfig.ETHERSCAN_APIKEY}`);
    const body = await response.json();

    if (body.result) { 
        return {
            lastBlock: Number(body.result.LastBlock),
            safe: Number(body.result.SafeGasPrice),
            recommended: Number(body.result.ProposeGasPrice)
        } as GasPrices
    }
}