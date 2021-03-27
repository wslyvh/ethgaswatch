import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';
import { WeiToGwei } from "../utils/parse";

export class GasNowCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        
        try { 
            const response = await fetch(`https://www.gasnow.org/api/v2/gas/price`);
            const body = await response.json();
    
            return {
                name: "GAS Now",
                source: "https://www.gasnow.org/",
                instant: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 50).gasPrice)), // instant
                fast: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 200).gasPrice)), // 1 min
                standard: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 500).gasPrice)), // 3 min 
                slow: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 1000).gasPrice)), // > 10
                lastUpdate: Number(body.data.timestamp)
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from GASNOW", ex);
            return null;
        }
    }
}
