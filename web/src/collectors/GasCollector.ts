import { RecommendedGasPrices } from "../types";
import { EtherchainCollector } from "./EtherchainCollector";
import { EtherscanCollector } from "./EtherscanCollector";
import { GasNowCollector } from "./GasNowCollector";
import { GasStationCollector } from "./GasStationCollector";
import { MyCryptoCollector } from "./MyCryptoCollector";
import { NetworkCollector } from "./NetworkCollector";
import { UpvestCollector } from "./UpvestCollector";

export interface IGasCollector{
    collect(): Promise<RecommendedGasPrices | null>;
}

interface ComponentClass {
    new(): IGasCollector;
}
const components: { [name: string]: IGasCollector } = {};

function init(params: ComponentClass[]) {
    params.map((component) => {
        let comp = new component();
        components[component.name] = comp;
    });
}

init([EtherscanCollector, EtherchainCollector, GasStationCollector, MyCryptoCollector, UpvestCollector, NetworkCollector, GasNowCollector ]);

export class GasCollector {
    gasCollectors : ComponentClass[] = [EtherscanCollector, EtherchainCollector, GasStationCollector, MyCryptoCollector, UpvestCollector, NetworkCollector, GasNowCollector ];

    async Get() : Promise<RecommendedGasPrices[]>{
        const results = new Array<RecommendedGasPrices>();
        const collectors = [];
        for (const c in components) {
            collectors.push(await components[c].collect().then(gas => {
                if(gas) results.push(gas);
            }));
        }

        await Promise.all([collectors]);

        return results;
    }
}
