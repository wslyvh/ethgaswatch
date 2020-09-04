import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetAllPrices } from '../services/GasService';
import { GetSpotPrice } from '../services/PriceService';
import { GweiToUsdTransfer } from '../utils/parse';
import { GasPriceData } from '../types';
import { SaveGasData } from '../services/GasService';

export async function handler(event: APIGatewayEvent, context: Context) {
    
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
        ethPrice,
        lastUpdated: Date.now(),
        sources: results
    } as GasPriceData;
    
    SaveGasData(data);

    return {
        statusCode: 200,
        body: `Ok.`
    }
}