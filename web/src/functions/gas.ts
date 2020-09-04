import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetAllPrices } from '../services/GasService';
import { GetSpotPrice } from '../services/PriceService';
import { GweiToUsdTransfer } from '../utils/parse';
import { GasPriceData } from '../types';

export async function handler(event: APIGatewayEvent, context: Context) {

    // TODO: Get from FaunDB, collection gas, where timestamp is highest 

    const ethPrice = await GetSpotPrice();
    const results = await GetAllPrices(true);
    const average = results[results.length - 1];
    results.pop();

    const data = {
        slow: { 
            gwei: average.slow,
            usd: parseFloat(GweiToUsdTransfer(average.slow, ethPrice)),
        },
        normal: {
            gwei: average.standard,
            usd: parseFloat(GweiToUsdTransfer(average.standard, ethPrice)),
        },
        fast: {
            gwei: average.fast,
            usd: parseFloat(GweiToUsdTransfer(average.fast, ethPrice)),
        },
        instant: {
            gwei: average.instant,
            usd: parseFloat(GweiToUsdTransfer(average.instant, ethPrice)),
        },
        ethPrice,
        lastUpdated: Date.now(),
        sources: results
    } as GasPriceData;

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    }
}