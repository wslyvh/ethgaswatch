import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";

export class UpvestCollector extends Collector{
    name = "Upvest";
    url = `https://fees.upvest.co/estimate_eth_fees`;

    async MapGas(body: any): Promise<RecommendedGasPrices | null> {

        return {
            name: this.name,
            source: "https://doc.upvest.co/reference#ethereum-fees",
            instant: Math.round(body.estimates.fastest),
            fast: Math.round(body.estimates.fast),
            standard: Math.round(body.estimates.medium),
            slow: Math.round(body.estimates.slow),
            lastUpdate: Date.now()
        } as RecommendedGasPrices;
    }
}
