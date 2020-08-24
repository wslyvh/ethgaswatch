export type RecommendedGasPrices = { 
    name: string;
    source: string;
    fast: number;
    average: number;
    low: number;
}

export type RegisteredEmailAddress = { 
    id: string;
    email: string;
    price: number;
}