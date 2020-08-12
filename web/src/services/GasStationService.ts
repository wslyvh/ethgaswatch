import { RecommendedGasPrices } from "../types";
import { ETH_GASSTATION_API_KEY } from "../constants";

export async function getGasPrices(): Promise<RecommendedGasPrices> { 

    const response = await fetch(`https://ethgasstation.info/api/ethgasAPI.json?api-key=${ETH_GASSTATION_API_KEY}`);
    const body = await response.json();

    console.log(body);

    return {
        fast: body.fastest / 10,
        fastWait: body.fastestWait,
        average: body.average / 10,
        averageWait: body.avgWait,
        low: body.safeLow / 10,
        lowWait: body.safeLowWait
    } as RecommendedGasPrices;
}
