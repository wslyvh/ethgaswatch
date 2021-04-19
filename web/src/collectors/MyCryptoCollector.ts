import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";

export class MyCryptoCollector extends Collector{
    name = "MyCrypto";
    url = `https://gas.mycryptoapi.com/`;
    async MapGas(body: any): Promise<RecommendedGasPrices | null> {
        
        return {
            name: this.name,
            source: this.url,
            instant: Math.round(body.fastest),
            fast: Math.round(body.fast),
            standard: Math.round(body.standard),
            slow: Math.round(body.safeLow),
            lastBlock: Number(body.blockNum)
        } as RecommendedGasPrices;
    }
}
