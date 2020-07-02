import { getGasprices } from "./etherscanClient"

console.log("hello gastracker")
getPrices();

async function getPrices() {
    const gasPrices = await getGasprices();
    console.log(gasPrices);
}