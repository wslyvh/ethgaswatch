export type RecommendedGasPrices = { 
    name: string;
    source: string;
    instant: number;
    fast: number;
    standard: number;
    slow: number;
    lastBlock?: number;
    lastUpdate?: number;
}

export type RegisteredEmailAddress = { 
    id: string;
    email: string;
    price: number;
    confirmed?: boolean;
    disabled?: boolean;
    emailSent?: boolean;
    lastModified?: number;
}

export type GasPriceData = { 
    slow: GasPriceValues,
    normal: GasPriceValues,
    fast: GasPriceValues,
    instant: GasPriceValues,
    ethPrice: number,
    lastUpdated: number,
    sources: RecommendedGasPrices[]
}

export type GasPriceValues = { 
    gwei: number,
    usd: number
}