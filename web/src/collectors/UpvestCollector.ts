import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';

export class UpvestCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        
        try { 
            const response = await fetch(`https://fees.upvest.co/estimate_eth_fees`);
            const body = await response.json();
    
            return {
                name: "Upvest",
                source: "https://doc.upvest.co/reference#ethereum-fees",
                instant: Math.round(body.estimates.fastest),
                fast: Math.round(body.estimates.fast),
                standard: Math.round(body.estimates.medium),
                slow: Math.round(body.estimates.slow),
                lastUpdate: Date.now()
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from UPVEST", ex);
            return null;
        }
    }
}