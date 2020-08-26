
import React, { useState, useEffect } from 'react';
import { RecommendedGasPrices } from '../types';
import { GasPriceCard } from './';

export const GasPriceRow = (props: RecommendedGasPrices) => {
    const [spotPrice, setSpotPrice] = useState<number>();

    useEffect(() => {
        async function asyncEffect() {
            const response = await fetch(`/.netlify/functions/spot`);
            const body = await response.json();

            setSpotPrice(body);
        }
        
        asyncEffect();
    }, []);

    if (!spotPrice) return <></>

    return (
        <>
            <div className="card-columns mt-5">
                <GasPriceCard title="Slow" price={props.low} spot={spotPrice} />
                <GasPriceCard title="Normal" price={props.average} spot={spotPrice} />
                <GasPriceCard title="Fast" price={props.fast} spot={spotPrice} />
            </div>
        </>
    )
}