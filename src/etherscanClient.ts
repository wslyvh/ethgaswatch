import { AppConfig } from "./config";

const fetch = require("node-fetch");

export async function getGasprices() { 
    const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${AppConfig.ETHERSCAN_APIKEY}`);
    const body = await response.json();

    if (body.result) { 
        return {
            lastBlock: Number(body.result.LastBlock),
            safeGasPrice: Number(body.result.SafeGasPrice),
            proposedGasPrice: Number(body.result.ProposeGasPrice)
        }
    }
}