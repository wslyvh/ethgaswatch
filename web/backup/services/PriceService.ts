import fetch from 'node-fetch';
require('encoding');

export async function GetSpotPrice() : Promise<number> { 

    const response = await fetch(`https://api.coinbase.com/v2/prices/ETH-USD/spot`);
    const body = await response.json();

    return parseFloat(body.data.amount);
}