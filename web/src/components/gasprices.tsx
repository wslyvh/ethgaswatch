
import React, { useEffect, useState } from 'react';
import { Loading } from './loading';
import { ErrorAlert } from './error';
import { getGasPrices } from '../services/GasStationService';
import { RecommendedGasPrices } from '../types';
import { GasPriceCard } from './gaspricecard';

export const GasPrices = () => {
    const [loading, setLoading] = useState(true);
    const [gasPrices, setGasPrices] = useState<RecommendedGasPrices>();

    useEffect(() => {
        async function asyncEffect() {      
            try {       
            const prices = await getGasPrices();

            setGasPrices(prices);
            setLoading(false);
            } catch (ex) { 
                console.log(ex);
                setLoading(false);
            }
        }
        
        asyncEffect();
    }, []);

    if (loading) { 
        return <Loading />
    } 

    if (!gasPrices) { 
        return <ErrorAlert message="Couldn't retrieve gas prices." />
    } 

    return (
        <div>
            <h2>Recommended Gas Prices</h2>

            <div className="card-columns">
                <GasPriceCard title="Low" price={gasPrices.low} wait={gasPrices.lowWait} />
                <GasPriceCard title="Average" price={gasPrices.average} wait={gasPrices.averageWait} />
                <GasPriceCard title="Fast" price={gasPrices.fast} wait={gasPrices.fastWait} />
            </div>
        </div>
    )
}