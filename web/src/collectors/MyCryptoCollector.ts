import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';

export class MyCryptoCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        
        try { 
            const response = await fetch(`https://gas.mycryptoapi.com/`);
            const body = await response.json();
    
            return {
                name: "MyCrypto",
                source: "https://gas.mycryptoapi.com/",
                instant: Math.round(body.fastest),
                fast: Math.round(body.fast),
                standard: Math.round(body.standard),
                slow: Math.round(body.safeLow),
                lastBlock: Number(body.blockNum)
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from MYCRYPTO", ex);
            return null;
        }
    }
}