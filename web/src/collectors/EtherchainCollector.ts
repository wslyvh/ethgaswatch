import { RecommendedGasPrices } from "../types";
import { IGasCollector } from "./GasCollector";
import fetch from 'node-fetch';

export class EtherchainCollector implements IGasCollector{
    async collect(): Promise<RecommendedGasPrices | null> {
        try { 
            const response = await fetch(`https://www.etherchain.org/api/gasPriceOracle`);
            const body = await response.json();
    
            return {
                name: "Etherchain",
                source: "https://etherchain.org/tools/gasPriceOracle",
                instant: Math.round(Number(body.fastest)),
                fast: Math.round(Number(body.fast)),
                standard: Math.round(Number(body.standard)),
                slow: Math.round(Number(body.safeLow)),
                lastUpdate: Date.now()
            } as RecommendedGasPrices;
    
        } catch (ex) { 
            console.log("Couldn't retrieve data from ETHERCHAIN", ex);
            return null;
        }
    }
}
