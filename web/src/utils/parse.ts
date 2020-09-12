
export function WeiToGwei(value: number): number { 
    return value / 1e9; 
}

export function GweiToEther(value: number): number { 
    return value / 1e9; 
}

export function GweiToUsdTransfer(value: number, spotPrice: number): string { 
    return (value * 21000 / 1e9 * spotPrice).toFixed(2);
}

export function TimestampToTimeAgo(timestamp: number): string {
    const currentDate = new Date(); 
    const currentTimestamp = Math.floor(currentDate.getTime() / 1000); 
    var seconds = currentTimestamp - (timestamp / 1000);

    if (seconds > 360 * 24 * 3600) {
        return "more than a year ago";
    }

    if (seconds > 60 * 24 * 3600) {
        return Math.floor(seconds / (60 * 12 * 3600)) + " months ago";
    }

    if (seconds > 30 * 24 * 3600) {
        return "a month ago";
    }

    if (seconds > 14 * 24 * 3600) {
        return Math.floor(seconds / (24 * 3600) / 7) + " weeks ago";
    }

    if (seconds > 7 * 24 * 3600) {
        return "a week ago";
    }

    if (seconds > 2 * 24 * 3600) {
        return Math.floor(seconds / (60 * 3600)) + " days ago";
    }
    
    if (seconds > 24 * 3600) {
        return "yesterday";
    }

    if (seconds > 3600) {
        return Math.floor(seconds / 3600) + " hours ago";
    }

    if (seconds > 60) {
        return Math.floor(seconds / 60) + " minutes ago";
    }

    if (seconds < 60) {
        return "a few seconds ago";
    }

    return new Date(timestamp).toUTCString();
}