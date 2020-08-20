require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import { fromGasStation, fromEtherscan, fromGasNow, fromUpvest, Average } from '../services/GasService';
import { RecommendedGasPrices } from '../types';

export async function handler(event: APIGatewayEvent, context: Context) {
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
        const prices = await fromGasNow();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from GASNOW", ex);
    }
    try {
        const prices = await fromUpvest();
        results.push(prices);
    } catch (ex) { 
        console.log("Couldn't retrieve data from UPVEST", ex);
    }

    const prices = Average(results);
    results.push(prices);

    return {
        statusCode: 200,
        body: JSON.stringify(results)
    }
}