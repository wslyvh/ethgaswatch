import { RecommendedGasPrices } from "../types";
import fetch from 'node-fetch';


export class Collector {
    protected name: string = "";
    protected url: string = "";

    async collect(): Promise<RecommendedGasPrices | null> {
        try{
            const response = await fetch(this.url);
            return this.MapGas(await response.json());
        }
        catch (ex) { 
            console.log("Couldn't retrieve data from " + this.name, ex);
            return null;
        }
    }

    protected async MapGas(body: string) : Promise<RecommendedGasPrices | null>{
        return null;
    }
}