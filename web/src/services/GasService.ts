import fetch from 'node-fetch';
import { RecommendedGasPrices } from "../types";
import { AppConfig } from "../config/app";
require('encoding');

export async function fromEtherscan(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${AppConfig.ETHERSCAN_APIKEY}`);
    const body = await response.json();
    console.log("ETHERSCAN", body);

    return {
        name: "Etherscan",
        source: "https://etherscan.io/gastracker",
        fast: Math.round(Number(body.result.FastGasPrice)),
        average: Math.round(Number(body.result.ProposeGasPrice)),
        low: Math.round(Number(body.result.SafeGasPrice)),
    } as RecommendedGasPrices;
}

export async function fromGasStation(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${AppConfig.GASSTATION_APIKEY}`);
    const body = await response.json();
    console.log("GASSTATION", body);

    return {
        name: "Gas station",
        source: "https://ethgasstation.info/",
        fast: Math.round(body.fastest / 10),
        average: Math.round(body.average / 10),
        low: Math.round(body.safeLow / 10),
    } as RecommendedGasPrices;
}

export async function fromGasNow(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://www.gasnow.org/api/v1/gas/price`);
    const body = await response.json();
    console.log("GASNOW", body);

    return {
        name: "GAS Now",
        source: "https://www.gasnow.org/",
        fast: Math.round(WeiToGwei(body.data.top50)),
        average: Math.round(WeiToGwei(body.data.top200)),
        low: Math.round(WeiToGwei(body.data.top400)),
    } as RecommendedGasPrices;
}

export async function fromUpvest(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://fees.upvest.co/estimate_eth_fees`);
    const body = await response.json();
    console.log("UPVEST", body);

    return {
        name: "Upvest",
        source: "https://doc.upvest.co/reference#ethereum-fees",
        fast: Math.round(body.estimates.fastest),
        average: Math.round(body.estimates.medium),
        low: Math.round(body.estimates.slow),
    } as RecommendedGasPrices;
}

export function Average(prices: RecommendedGasPrices[]) : RecommendedGasPrices { 

    var fast = prices.filter(i => i.fast > 0).map(i => i.fast).reduce((a, v) => a + v) / prices.filter(i => i.fast > 0).length;
    var average = prices.filter(i => i.average > 0).map(i => i.average).reduce((a, v) => a + v) / prices.filter(i => i.average > 0).length;
    var low = prices.filter(i => i.low > 0).map(i => i.low).reduce((a, v) => a + v) / prices.filter(i => i.low > 0).length;

    return {
        name: "AVERAGE",
        fast: Math.round(fast),
        average: Math.round(average),
        low: Math.round(low),
    } as RecommendedGasPrices;
}

export function WeiToGwei(value: number): number { 
    return value / 1e9; 
}