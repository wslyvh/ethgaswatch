import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';

export class NetworkCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        
        try {
            const response = await fetch(`https://gasprice.poa.network/`);
            const body = await response.json();
    
            return {
                name: "POA Network",
                source: "https://gasprice.poa.network/",
                instant: Math.round(body.instant),
                fast: Math.round(body.fast),
                standard: Math.round(body.standard),
                slow: Math.round(body.slow),
                lastBlock: Number(body.block_number)
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from POA NETWORK", ex);
            return null;
        }
    }
}