import { AppConfig } from "../config/app";
import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';

export class EtherscanCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        try { 
            const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${AppConfig.ETHERSCAN_APIKEY}`);
            const body = await response.json();
    
            return {
                name: "Etherscan",
                source: "https://etherscan.io/gastracker",
                // NO instant
                fast: Math.round(Number(body.result.FastGasPrice)),
                standard: Math.round(Number(body.result.ProposeGasPrice)),
                slow: Math.round(Number(body.result.SafeGasPrice)),
                lastBlock: Number(body.result.LastBlock)
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from ETHERSCAN", ex);
            return null;
        }
    }
}