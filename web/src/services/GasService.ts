import { RecommendedGasPrices } from "../types";
import { ETHERSCAN_APIKEY, GASSTATION_APIKEY } from "../constants";

export async function fromEtherscan(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${ETHERSCAN_APIKEY}`);
    const body = await response.json();

    console.log("ETHERSCAN", body);

    return {
        fast: Number(body.result.FastGasPrice),
        fastWait: 0,
        average: Number(body.result.ProposeGasPrice),
        averageWait: 0,
        low: Number(body.result.SafeGasPrice),
        lowWait: 0,
    } as RecommendedGasPrices;
}

export async function fromGasStation(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${GASSTATION_APIKEY}`);
    const body = await response.json();

    console.log("GASSTATION", body);

    return {
        fast: body.fastest / 10,
        fastWait: body.fastestWait,
        average: body.average / 10,
        averageWait: body.avgWait,
        low: body.safeLow / 10,
        lowWait: body.safeLowWait
    } as RecommendedGasPrices;
}

export async function fromGasNow(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://ethgas.watch/.netlify/functions/gasnow`);

    console.log(response);
    const body = await response.json();

    console.log("GASNOW", body);

    return {
        fast: WeiToGwei(body.data.top50),
        fastWait: 0,
        average: WeiToGwei(body.data.top200),
        averageWait: 0,
        low: WeiToGwei(body.data.top400),
        lowWait: 0
    } as RecommendedGasPrices;
}

export async function fromUpvest(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://fees.upvest.co/estimate_eth_fees`);

    console.log(response);
    const body = await response.json();

    console.log("UPVEST", body);

    return {
        fast: body.estimates.fastest,
        fastWait: 0,
        average: body.estimates.medium,
        averageWait: 0,
        low: body.estimates.slow,
        lowWait: 0
    } as RecommendedGasPrices;
}

export function Average(prices: RecommendedGasPrices[]) : RecommendedGasPrices { 

    var fast = prices.filter(i => i.fast > 0).map(i => i.fast).reduce((a, v) => a + v) / prices.filter(i => i.fast > 0).length;
    var average = prices.filter(i => i.average > 0).map(i => i.average).reduce((a, v) => a + v) / prices.filter(i => i.average > 0).length;
    var low = prices.filter(i => i.low > 0).map(i => i.low).reduce((a, v) => a + v) / prices.filter(i => i.low > 0).length;

    return {
        fast: fast,
        fastWait: 1,
        average: average,
        averageWait: 1,
        low: low,
        lowWait: 1
    } as RecommendedGasPrices;
}

export function WeiToGwei(value: number): number { 
    return value / 1e9; 
}