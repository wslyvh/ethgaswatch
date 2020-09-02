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

export type GasData = { 
    data: GasPriceData,
    sources: RecommendedGasPrices[]
}

export type GasPriceData = { 
    slow: GasPriceValues,
    normal: GasPriceValues,
    fast: GasPriceValues,
    ethPrice: number,
    lastUpdated: number,
}

export type GasPriceValues = { 
    gwei: number,
    usd: number
}