
export function GetAverage(values: number[]): number { 
    
    return values.reduce((a, v) => a + v) / values.length;
}

export function GetMedian(values: number[]): number { 
    const prices = values.sort();
    const mid = Math.ceil(prices.length / 2);

    return prices.length % 2 == 0 ? (prices[mid] + prices[mid - 1]) / 2 : prices[mid - 1];
}

export function GetMode(values: number[]): number { 
    const mode: any = {};
    let max = 0, count = 0;

    values.forEach((i: any) => {
        if (mode[i]) mode[i]++;
        else mode[i] = 1;

        if (count < mode[i]) {
            max = i;
            count = mode[i];
        }
    });

    return max;
}