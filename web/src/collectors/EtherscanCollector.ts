import { AppConfig } from "../config/app";
import { RecommendedGasPrices } from "../types";
import { Collector } from "./Collector";

export class EtherscanCollector extends Collector{
    name = "Etherscan";
    url = `https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${AppConfig.ETHERSCAN_APIKEY}`;
    
    async MapGas(body: any): Promise<RecommendedGasPrices | null> {

        return {
            name: this.name,
            source: "https://etherscan.io/gastracker",
            // NO instant
            fast: Math.round(Number(body.result.FastGasPrice)),
            standard: Math.round(Number(body.result.ProposeGasPrice)),
            slow: Math.round(Number(body.result.SafeGasPrice)),
            lastBlock: Number(body.result.LastBlock)
        } as RecommendedGasPrices;
    }
}
