import { Context, APIGatewayEvent } from 'aws-lambda'
import { Connect, GetAllPrices, SaveGasData } from '../services/GasService';
import { GetSpotPrice } from '../services/PriceService';
import { GweiToUsdTransfer } from '../utils/parse';
import { GasPriceData } from '../types';

Connect().then(() => console.log("GasService Connected"));

export async function handler(event: APIGatewayEvent, context: Context) {
    context.callbackWaitsForEmptyEventLoop = false;
    
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
    
    await SaveGasData(data);

    return {
        statusCode: 200,
        body: `Ok.`
    }
}