import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";

export class EtherchainCollector extends Collector{
    name = "Etherchain";
    url = `https://www.etherchain.org/api/gasPriceOracle`;

    async MapGas(body: any): Promise<RecommendedGasPrices | null> {

        return {
            name: this.name,
            source: "https://etherchain.org/tools/gasPriceOracle",
            instant: Math.round(Number(body.fastest)),
            fast: Math.round(Number(body.fast)),
            standard: Math.round(Number(body.standard)),
            slow: Math.round(Number(body.safeLow)),
            lastUpdate: Date.now()
        } as RecommendedGasPrices;
    }
}
