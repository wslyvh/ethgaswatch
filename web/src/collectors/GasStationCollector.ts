import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';
import { AppConfig } from "../config/app";

export class GasStationCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        
        try { 
            const response = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${AppConfig.GASSTATION_APIKEY}`);
            const body = await response.json();
    
            return {
                name: "Gas station",
                source: "https://ethgasstation.info/",
                instant: Math.round(body.fastest / 10),
                fast: Math.round(body.fast / 10),
                standard: Math.round(body.average / 10),
                slow: Math.round(body.safeLow / 10),
                lastBlock: Number(body.blockNum)
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from GAS STATION", ex);
            return null;
        }
    }
}