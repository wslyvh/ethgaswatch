import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";
import { WeiToGwei } from "../utils/parse";

export class GasNowCollector extends Collector{
    name = "GAS Now";
    url = "https://www.gasnow.org/api/v2/gas/price";
    async MapGas(body: any): Promise<RecommendedGasPrices | null> {
        
        return {
            name: this.name,
            source: "https://www.gasnow.org/",
            instant: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 50).gasPrice)), // instant
            fast: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 200).gasPrice)), // 1 min
            standard: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 500).gasPrice)), // 3 min 
            slow: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 1000).gasPrice)), // > 10
            lastUpdate: Number(body.data.timestamp)
        } as RecommendedGasPrices;
    }
}
