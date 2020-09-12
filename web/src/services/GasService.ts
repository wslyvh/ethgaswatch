require('encoding');
require('mongodb-client-encryption');
const MongoClient = require('mongodb').MongoClient;
import fetch from 'node-fetch';
import { RecommendedGasPrices, GasPriceData } from "../types";
import { AppConfig } from "../config/app";
import { WeiToGwei } from '../utils/parse';
import { AVERAGE_NAME } from '../utils/constants';

const db_collection = "gasdata"

export async function GetAllPrices(includeAverage?: boolean): Promise<RecommendedGasPrices[]> { 
    
    const results = new Array<RecommendedGasPrices>();

    await Promise.all([
        await fromEtherscan(),
        await fromEtherchain(),
        await fromGasStation(),
        await fromGasNow(),
        await fromMyCrypto(),
        await fromPoaNetwork(),
        await fromUpvest()].map(i => {
        if(i) results.push(i);
    }));

    if (includeAverage) {
        const medianPrices = Average(results, true);
        results.push(medianPrices);
    }

    return results;
}

export async function GetAveragePrice(): Promise<RecommendedGasPrices> { 

    const results = await GetAllPrices(true);
    const avg = results.find(i => i.name === AVERAGE_NAME)

    return Average(results, true);
}

export async function fromEtherscan(): Promise<RecommendedGasPrices | null> { 

    try { 
        const response = await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${AppConfig.ETHERSCAN_APIKEY}`);
        const body = await response.json();

        return {
            name: "Etherscan",
            source: "https://etherscan.io/gastracker",
            // NO instant
            fast: Math.round(Number(body.result.FastGasPrice)),
            standard: Math.round(Number(body.result.ProposeGasPrice)),
            slow: Math.round(Number(body.result.SafeGasPrice)),
            lastBlock: Number(body.result.LastBlock)
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from ETHERSCAN", ex);
        return null;
    }
}

export async function fromEtherchain(): Promise<RecommendedGasPrices | null> { 

    try { 
        const response = await fetch(`https://www.etherchain.org/api/gasPriceOracle`);
        const body = await response.json();

        return {
            name: "Etherchain",
            source: "https://etherchain.org/tools/gasPriceOracle",
            instant: Math.round(Number(body.fastest)),
            fast: Math.round(Number(body.fast)),
            standard: Math.round(Number(body.standard)),
            slow: Math.round(Number(body.safeLow)),
            lastUpdate: Date.now()
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from ETHERCHAIN", ex);
        return null;
    }
}

export async function fromGasStation(): Promise<RecommendedGasPrices | null> { 

    try { 
        const response = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${AppConfig.GASSTATION_APIKEY}`);
        const body = await response.json();

        return {
            name: "Gas station",
            source: "https://ethgasstation.info/",
            instant: Math.round(body.fastest / 10),
            fast: Math.round(body.fast / 10),
            standard: Math.round(body.average / 10),
            slow: Math.round(body.safeLow / 10),
            lastBlock: Number(body.blockNum)
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from GAS STATION", ex);
        return null;
    }
}

export async function fromGasNow(): Promise<RecommendedGasPrices | null> { 

    try { 
        const response = await fetch(`https://www.gasnow.org/api/v2/gas/price`);
        const body = await response.json();

        return {
            name: "GAS Now",
            source: "https://www.gasnow.org/",
            instant: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 50).gasPrice)), // instant
            fast: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 200).gasPrice)), // 1 min
            standard: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 500).gasPrice)), // 3 min 
            slow: Math.round(WeiToGwei(body.data.list.find((i: any) => i.index === 1000).gasPrice)), // > 10
            lastUpdate: Number(body.data.timestamp)
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from GASNOW", ex);
        return null;
    }
}

export async function fromMyCrypto(): Promise<RecommendedGasPrices | null> { 
    
    try { 
        const response = await fetch(`https://gas.mycryptoapi.com/`);
        const body = await response.json();

        return {
            name: "MyCrypto",
            source: "https://gas.mycryptoapi.com/",
            instant: Math.round(body.fastest),
            fast: Math.round(body.fast),
            standard: Math.round(body.standard),
            slow: Math.round(body.safeLow),
            lastBlock: Number(body.blockNum)
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from MYCRYPTO", ex);
        return null;
    }
}


export async function fromPoaNetwork(): Promise<RecommendedGasPrices | null> { 
    
    try {
        const response = await fetch(`https://gasprice.poa.network/`);
        const body = await response.json();

        return {
            name: "POA Network",
            source: "https://gasprice.poa.network/",
            instant: Math.round(body.instant),
            fast: Math.round(body.fast),
            standard: Math.round(body.standard),
            slow: Math.round(body.slow),
            lastBlock: Number(body.block_number)
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from POA NETWORK", ex);
        return null;
    }
}

export async function fromUpvest(): Promise<RecommendedGasPrices | null> { 

    try { 
        const response = await fetch(`https://fees.upvest.co/estimate_eth_fees`);
        const body = await response.json();

        return {
            name: "Upvest",
            source: "https://doc.upvest.co/reference#ethereum-fees",
            instant: Math.round(body.estimates.fastest),
            fast: Math.round(body.estimates.fast),
            standard: Math.round(body.estimates.medium),
            slow: Math.round(body.estimates.slow),
            lastUpdate: Date.now()
        } as RecommendedGasPrices;

    } catch (ex) { 
        console.log("Couldn't retrieve data from UPVEST", ex);
        return null;
    }
}

export async function GetLatestGasData(): Promise<GasPriceData | null> { 
    try { 
        const dbCollection = await getDatabaseCollection();
        const items = await dbCollection.find().sort({ _id: -1 }).limit(1).toArray();

        if (items && items.length === 1) { 
            return items[0].data as GasPriceData;
        }

        return null;

    } catch(ex) { 
        console.log("Failed to retrieve gas data", ex);
        return null
    }
}

export async function SaveGasData(data: GasPriceData) { 

    try { 
        const dbCollection = await getDatabaseCollection();
        
        await dbCollection.insertOne({ data });
    } catch(ex) { 
        console.log("Failed to save gas data", ex);
    }
}

export function Average(prices: RecommendedGasPrices[], median: boolean): RecommendedGasPrices { 

    if (median) {
        var instant = GetMedian(prices.filter(i => i.instant > 0).map(i => i.instant));
        var fast = GetMedian(prices.filter(i => i.fast > 0).map(i => i.fast));
        var standard = GetMedian(prices.filter(i => i.standard > 0).map(i => i.standard));
        var slow = GetMedian(prices.filter(i => i.slow > 0).map(i => i.slow));
    } else { 
        var instant = GetAverage(prices.filter(i => i.instant > 0).map(i => i.instant));
        var fast = GetAverage(prices.filter(i => i.fast > 0).map(i => i.fast));
        var standard = GetAverage(prices.filter(i => i.standard > 0).map(i => i.standard));
        var slow = GetAverage(prices.filter(i => i.slow > 0).map(i => i.slow));
    }

    return {
        name: AVERAGE_NAME,
        instant: Math.round(instant),
        fast: Math.round(fast),
        standard: Math.round(standard),
        slow: Math.round(slow),
    } as RecommendedGasPrices;
}

export function GetAverage(values: number[]): number { 
    
    return values.reduce((a, v) => a + v) / values.length;
}

export function GetMedian(values: number[]): number { 
    const prices = values.sort();
    const mid = Math.ceil(prices.length / 2);

    return prices.length % 2 == 0 ? (prices[mid] + prices[mid - 1]) / 2 : prices[mid - 1];
}

async function getDatabaseCollection(): Promise<any> { 
    const client = await MongoClient.connect(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
    const db = client.db(AppConfig.MONGODB_DB);
    return db.collection(db_collection); 
}