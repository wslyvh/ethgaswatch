
export function WeiToGwei(value: number): number { 
    return value / 1e9; 
}

export function GweiToEther(value: number): number { 
    return value / 1e9; 
}

export function GweiToUsdTransfer(value: number, spotPrice: number): string { 
    return (value * 21000 / 1e9 * spotPrice).toFixed(2);
}