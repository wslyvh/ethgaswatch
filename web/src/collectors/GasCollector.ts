import { RecommendedGasPrices } from "../types";
import { EtherchainCollector } from "./EtherchainCollector";
import { EtherscanCollector } from "./EtherscanCollector";
import { GasNowCollector } from "./GasNowCollector";
import { GasStationCollector } from "./GasStationCollector";
import { MyCryptoCollector } from "./MyCryptoCollector";
import { NetworkCollector } from "./NetworkCollector";
import { UpvestCollector } from "./UpvestCollector";
import { Collector } from "./Collector";


export class GasCollector {

    async Get() : Promise<RecommendedGasPrices[]>{

        const collectors : (typeof Collector)[] = [EtherscanCollector, EtherchainCollector, GasNowCollector, GasStationCollector, MyCryptoCollector, NetworkCollector, UpvestCollector];
        const results = new Array<RecommendedGasPrices>();
        const gases = await Promise.all(collectors
            .map(async collector => {
                return new collector().collect();
            }));
            
        gases.map(gas => {
            if(gas) results.push(gas); 
        });

        return results;
    }
}
