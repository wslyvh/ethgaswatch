
import React from 'react';
import { RecommendedGasPrices } from '../types';
import { GasPriceCard } from './';

export const GasPriceRow = (props: RecommendedGasPrices) => {

    return (
        <>
            <div className="card-columns mt-5">
                <GasPriceCard title="Slow" price={props.low} />
                <GasPriceCard title="Normal" price={props.average} />
                <GasPriceCard title="Fast" price={props.fast} />
            </div>
        </>
    )
}