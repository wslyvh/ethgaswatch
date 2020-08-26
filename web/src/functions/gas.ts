require('encoding');
import { Context, APIGatewayEvent } from 'aws-lambda'
import { GetAllPrices } from '../services/GasService';
import { GetSpotPrice } from '../services/PriceService';
import { GweiToUsdTransfer } from '../utils/parse';

export async function handler(event: APIGatewayEvent, context: Context) {

    const spotPrice = await GetSpotPrice();
    const results = await GetAllPrices();
    const average = results[results.length - 1];
    results.pop();

    const gas = {
        data: {
            slow: average.low,
            slowUsd: parseFloat(GweiToUsdTransfer(average.low, spotPrice)),
            normal: average.average,
            normalUsd: parseFloat(GweiToUsdTransfer(average.average, spotPrice)),
            fast: average.fast,
            fastUsd: parseFloat(GweiToUsdTransfer(average.fast, spotPrice)),
            spotPrice,
            lastUpdated: Date.now()
        },
        sources: results
    }

    return {
        statusCode: 200,
        body: JSON.stringify(gas)
    }
}