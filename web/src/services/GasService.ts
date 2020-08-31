import fetch from 'node-fetch';
import { RecommendedGasPrices } from "../types";
import { AppConfig } from "../config/app";
import { WeiToGwei } from '../utils/parse';
import { AVERAGE_NAME } from '../utils/constants';
require('encoding');

export async function GetAllPrices(includeAverage?: boolean): Promise<RecommendedGasPrices[]> { 

    const results = new Array<RecommendedGasPrices>();
    try {
        const prices = await fromGasStation();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from GAS STATION", ex);
    }
    try {
        const prices = await fromEtherscan();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from ETHERSCAN", ex);
    }
    try {
        const prices = await fromEtherchain();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from ETHERCHAIN", ex);
    }    
    try {
        const prices = await fromGasNow();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from GASNOW", ex);
    }
    try {
        const prices = await fromMyCrypto();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from MyCrypto", ex);
    }
    try {
        const prices = await fromUpvest();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from UPVEST", ex);
    }

    if (includeAverage) {
        const prices = Average(results);
        results.push(prices);
    }

    return results;
}

export async function GetAveragePrice(): Promise<RecommendedGasPrices> { 

    const results = await GetAllPrices(true);
    const avg = results.find(i => i.name === AVERAGE_NAME)

    return Average(results);
}

export async function fromEtherscan(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${AppConfig.ETHERSCAN_APIKEY}`);
    const body = await response.json();

    return {
        name: "Etherscan",
        source: "https://etherscan.io/gastracker",
        fast: Math.round(Number(body.result.FastGasPrice)),
        average: Math.round(Number(body.result.ProposeGasPrice)),
        low: Math.round(Number(body.result.SafeGasPrice)),
        lastBlock: Number(body.result.LastBlock)
    } as RecommendedGasPrices;
}

export async function fromEtherchain(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://www.etherchain.org/api/gasPriceOracle`);
    const body = await response.json();

    return {
        name: "Etherchain",
        source: "https://etherchain.org/tools/gasPriceOracle",
        fast: Number(body.fast),
        average: Number(body.standard),
        low: Number(body.safeLow),
        lastUpdate: Date.now()
    } as RecommendedGasPrices;
}

export async function fromGasStation(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${AppConfig.GASSTATION_APIKEY}`);
    const body = await response.json();

    return {
        name: "Gas station",
        source: "https://ethgasstation.info/",
        fast: Math.round(body.fastest / 10),
        average: Math.round(body.average / 10),
        low: Math.round(body.safeLow / 10),
        lastBlock: Number(body.blockNum)
    } as RecommendedGasPrices;
}

export async function fromGasNow(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://www.gasnow.org/api/v1/gas/price`);
    const body = await response.json();

    return {
        name: "GAS Now",
        source: "https://www.gasnow.org/",
        fast: Math.round(WeiToGwei(body.data.top50)),
        average: Math.round(WeiToGwei(body.data.top200)),
        low: Math.round(WeiToGwei(body.data.top400)),
        lastUpdate: Number(body.data.timestamp)
    } as RecommendedGasPrices;
}

export async function fromMyCrypto(): Promise<RecommendedGasPrices> { 
    
    const response = await fetch(`https://gas.mycryptoapi.com/`);
    const body = await response.json();

    return {
        name: "MyCrypto",
        source: "https://gas.mycryptoapi.com/",
        fast: Math.round(body.fastest),
        average: Math.round(body.standard),
        low: Math.round(body.safeLow),
        lastBlock: Number(body.blockNum)
    } as RecommendedGasPrices;
}

export async function fromUpvest(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://fees.upvest.co/estimate_eth_fees`);
    const body = await response.json();

    return {
        name: "Upvest",
        source: "https://doc.upvest.co/reference#ethereum-fees",
        fast: Math.round(body.estimates.fastest),
        average: Math.round(body.estimates.medium),
        low: Math.round(body.estimates.slow),
        lastUpdate: Date.now()
    } as RecommendedGasPrices;
}

export function Average(prices: RecommendedGasPrices[]) : RecommendedGasPrices { 

    var fast = prices.filter(i => i.fast > 0).map(i => i.fast).reduce((a, v) => a + v) / prices.filter(i => i.fast > 0).length;
    var average = prices.filter(i => i.average > 0).map(i => i.average).reduce((a, v) => a + v) / prices.filter(i => i.average > 0).length;
    var low = prices.filter(i => i.low > 0).map(i => i.low).reduce((a, v) => a + v) / prices.filter(i => i.low > 0).length;

    return {
        name: AVERAGE_NAME,
        fast: Math.round(fast),
        average: Math.round(average),
        low: Math.round(low),
    } as RecommendedGasPrices;
}