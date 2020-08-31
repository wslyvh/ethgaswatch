require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetAllPrices } from '../services/GasService';
import { GetSpotPrice } from '../services/PriceService';
import { GweiToUsdTransfer } from '../utils/parse';

export async function handler(event: APIGatewayEvent, context: Context) {

    const ethPrice = await GetSpotPrice();
    const results = await GetAllPrices(true);
    const average = results[results.length - 1];
    results.pop();

    const gas = {
        data: {
            slow: { 
                gwei: average.low,
                usd: parseFloat(GweiToUsdTransfer(average.low, ethPrice)),
            },
            normal: {
                gwei: average.average,
                usd: parseFloat(GweiToUsdTransfer(average.average, ethPrice)),
            },
            fast: {
                gwei: average.fast,
                usd: parseFloat(GweiToUsdTransfer(average.fast, ethPrice)),
            },
            ethPrice,
            lastUpdated: Date.now()
        },
        sources: results
    }

    return {
        statusCode: 200,
        body: JSON.stringify(gas)
    }
}