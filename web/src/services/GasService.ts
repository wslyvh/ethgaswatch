require('encoding');
require('mongodb-client-encryption');
import { MongoClient } from 'mongodb';
import { RecommendedGasPrices, GasPriceData, TrendChartData } from "../types";
import { AppConfig } from "../config/app";
import { AVERAGE_NAME } from '../utils/constants';
import moment from 'moment';
import { GetMedian } from '../utils/stats';
import { GasCollector } from '../collectors/GasCollector';

const db_collection = "gasdata"
let dbClient: MongoClient | null = null;

export async function Connect(): Promise<MongoClient> {
    if (!dbClient) {
        dbClient = await MongoClient.connect(AppConfig.MONGODB_CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true  });
        console.log("gasdata connected..");
    }

    return dbClient;
}

export async function GetAllPrices(includeAverage?: boolean): Promise<RecommendedGasPrices[]> { 

    var factory = new GasCollector();
    const results = await factory.Get();

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

function MapAverageGasData(reduced: any) : TrendChartData{
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