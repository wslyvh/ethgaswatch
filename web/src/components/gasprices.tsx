
import React, { useEffect, useState } from 'react';
import { Loading } from './loading';
import { getGasPrices } from '../services/GasStationService';
import { RecommendedGasPrices } from '../types';

export const GasPrices = () => {
    const [loading, setLoading] = useState(true);
    const [gasPrices, setGasPrices] = useState<RecommendedGasPrices | undefined>(undefined);

    useEffect(() => {
        async function asyncEffect() {            
            const prices = await getGasPrices();

            setGasPrices(prices);
            setLoading(false);
        }
        
        asyncEffect();
    }, []);

    if (loading) { 
        return <Loading />
    } 

    return (
        <div>
            <h2>Recommended Gas Prices</h2>
            <div>
                <h3>Low</h3>
                {gasPrices?.low} ~{gasPrices?.lowWait}m
            </div>
            <div>
                <h3>Average</h3>
                {gasPrices?.average} ~{gasPrices?.averageWait}m
            </div>
            <div>
                <h3>Fast</h3>
                {gasPrices?.fast} ~{gasPrices?.fastWait}m
            </div>
        </div>
    )
}