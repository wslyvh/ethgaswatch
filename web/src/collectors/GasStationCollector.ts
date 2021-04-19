import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";
import { AppConfig } from "../config/app";

export class GasStationCollector extends Collector{
    name = "Gas station";
    url = `https://ethgasstation.info/api/ethgasAPI.json?api-key=${AppConfig.GASSTATION_APIKEY}`;
    async MapGas(body: any): Promise<RecommendedGasPrices | null> {

        return {
            name: this.name,
            source: "https://ethgasstation.info/",
            instant: Math.round(body.fastest / 10),
            fast: Math.round(body.fast / 10),
            standard: Math.round(body.average / 10),
            slow: Math.round(body.safeLow / 10),
            lastBlock: Number(body.blockNum)
        } as RecommendedGasPrices;
    }
}
