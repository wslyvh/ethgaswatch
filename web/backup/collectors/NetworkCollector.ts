import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";

export class NetworkCollector extends Collector{
    name = "POA Network";
    url = `https://gasprice.poa.network/`;

    async MapGas(body: any): Promise<RecommendedGasPrices | null> {

        return {
            name: this.name,
            source: this.url,
            instant: Math.round(body.instant),
            fast: Math.round(body.fast),
            standard: Math.round(body.standard),
            slow: Math.round(body.slow),
            lastBlock: Number(body.block_number)
        } as RecommendedGasPrices;
    }
}
