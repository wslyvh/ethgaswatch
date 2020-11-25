require('encoding');
require('mongodb-client-encryption');
import { MongoClient } from 'mongodb';
import fetch from 'node-fetch';
import { RecommendedGasPrices, GasPriceData, TrendChartData } from "../types";
import { AppConfig } from "../config/app";
import { WeiToGwei } from '../utils/parse';
import { AVERAGE_NAME } from '../utils/constants';
import moment from 'moment';
import { GetMedian } from '../utils/stats';

const db_collection = "gasdata"
let dbClient: MongoClient | null = null;

export async function Connect(): Promise<MongoClient> {
    if (!dbClient) {
        dbClient = await MongoClient.connect(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true });
        console.log("gasdata connected..");
    }

    return dbClient;
}

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
        const medianPrices = Average(results);
        results.push(medianPrices);
    }

    return results;
}

export async function GetAveragePrice(): Promise<RecommendedGasPrices> { 

    const results = await GetAllPrices(true);
    return Average(results);
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

export async function GetDailyAverageGasData(days: number): Promise<TrendChartData | null> { 

    try { 
        const dbCollection = await getDatabaseCollection();
        const since = moment().subtract(days, "days");

        const items = await dbCollection.find({ "data.lastUpdated": { $gte: since.valueOf() } }).toArray();

        var reduced = items.reduce((accumulator: any, item: any) => {
            const day = moment(item.data.lastUpdated).startOf("day").format("ll");
            accumulator[day] = accumulator[day] || []; 
            accumulator[day].push(item); 

            return accumulator;
        }, {});

        const result = {
            labels: Array<string>(),
            slow: Array<number>(),
            normal: Array<number>(),
            fast: Array<number>(),
            instant: Array<number>()
        } as TrendChartData;

        Object.keys(reduced).forEach(i => {
            let slow: number[] = [];
            let normal: number[] = [];
            let fast: number[] = [];
            let instant: number[] = [];

            reduced[i].forEach((gasdata: any) => {
                const gas = gasdata.data as GasPriceData;
                if (gas.slow) slow.push(gas.slow.gwei);
                if (gas.normal) normal.push(gas.normal.gwei);
                if (gas.fast) fast.push(gas.fast.gwei);
                if (gas.instant) instant.push(gas.instant.gwei);
            });

            result.labels.push(i);
            result.slow.push(GetMedian(slow));
            result.normal.push(GetMedian(normal));
            result.fast.push(GetMedian(fast));
            result.instant.push(GetMedian(instant));
        })
        
        return result;

    } catch(ex) { 
        console.log("Failed to query daily avg gas data", ex);
        return null
    }
}

export async function GetHourlyAverageGasData(hours: number): Promise<TrendChartData | null> { 

    try { 
        const dbCollection = await getDatabaseCollection();
        const since = moment().subtract(hours, "hours");

        const items = await dbCollection.find({ "data.lastUpdated": { $gte: since.valueOf() } }).toArray();

        var reduced = items.reduce((accumulator: any, item: any) => {
            const hour = moment(item.data.lastUpdated).startOf("hour").format("D/MM HH:mm");
            accumulator[hour] = accumulator[hour] || []; 
            accumulator[hour].push(item); 

            return accumulator;
        }, {});

        const result = {
            labels: Array<string>(),
            slow: Array<number>(),
            normal: Array<number>(),
            fast: Array<number>(),
            instant: Array<number>()
        } as TrendChartData;

        Object.keys(reduced).forEach(i => {
            let slow: number[] = [];
            let normal: number[] = [];
            let fast: number[] = [];
            let instant: number[] = [];

            reduced[i].forEach((gasdata: any) => {
                const gas = gasdata.data as GasPriceData;
                if (gas.slow) slow.push(gas.slow.gwei);
                if (gas.normal) normal.push(gas.normal.gwei);
                if (gas.fast) fast.push(gas.fast.gwei);
                if (gas.instant) instant.push(gas.instant.gwei);
            });

            result.labels.push(i);
            result.slow.push(GetMedian(slow));
            result.normal.push(GetMedian(normal));
            result.fast.push(GetMedian(fast));
            result.instant.push(GetMedian(instant));
        })
        
        return result;

    } catch(ex) { 
        console.log("Failed to query daily avg gas data", ex);
        return null
    }
}

export function Average(prices: RecommendedGasPrices[]): RecommendedGasPrices { 

    const validPrices = prices.filter(i => ValidateGasPriceOrder(i));
    console.log("Get average", prices.length, "data sources.", validPrices.length, "valid.");
    var instant = GetMedian(validPrices.filter(i => i.instant > 0).map(i => i.instant));
    var fast = GetMedian(validPrices.filter(i => i.fast > 0).map(i => i.fast));
    var standard = GetMedian(validPrices.filter(i => i.standard > 0).map(i => i.standard));
    var slow = GetMedian(validPrices.filter(i => i.slow > 0).map(i => i.slow));

    return {
        name: AVERAGE_NAME,
        instant: Math.round(instant),
        fast: Math.round(fast),
        standard: Math.round(standard),
        slow: Math.round(slow),
    } as RecommendedGasPrices;
}

function ValidateGasPriceOrder(prices: RecommendedGasPrices): boolean { 
    let result = prices.slow <= prices.standard && prices.standard <= prices.fast;
    if (prices.instant) 
        result = result && prices.fast <= prices.instant;

    if (!result) { 
        console.log("NOT a valid gas prices", prices.name, prices.slow, prices.standard, prices.fast, prices.instant);
    }

    return result;
}

async function getDatabaseCollection(): Promise<any> { 
    const client = await Connect();
    const db = client.db(AppConfig.MONGODB_DB);
    return db.collection(db_collection); 
}