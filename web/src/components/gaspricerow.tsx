
import React from 'react';
import { RecommendedGasPrices } from '../types';
import { GasPriceCard } from './';

interface GasPriceRowProps { 
    source: string,
    gasPrices?: RecommendedGasPrices
}

export const GasPriceRow = (props: GasPriceRowProps) => {

    if (props.gasPrices) { 
        return (
            <>
                <div className="card-columns mt-5">
                    <GasPriceCard title="Low" price={props.gasPrices.low} />
                    <GasPriceCard title="Average" price={props.gasPrices.average} />
                    <GasPriceCard title="Fast" price={props.gasPrices.fast} />
                </div>
            </>
        )
    }

    return <></>
}