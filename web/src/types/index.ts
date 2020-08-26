export type RecommendedGasPrices = { 
    name: string;
    source: string;
    fast: number;
    average: number;
    low: number;
    lastBlock?: number;
    lastUpdate?: number;
}

export type RegisteredEmailAddress = { 
    id: string;
    email: string;
    price: number;
}