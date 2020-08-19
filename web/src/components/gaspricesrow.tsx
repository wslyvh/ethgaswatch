
import React from 'react';
import { RecommendedGasPrices } from '../types';
import { GasPriceCard } from './gaspricecard';

interface GasPricesRowProps { 
    source: string,
    gasPrices?: RecommendedGasPrices
}

export const GasPricesRow = (props: GasPricesRowProps) => {

    if (props.gasPrices) { 
        return (
            <>
                <h3>{props.source}</h3>
                <div className="card-columns">
                    <GasPriceCard title="Low" price={props.gasPrices.low} />
                    <GasPriceCard title="Average" price={props.gasPrices.average} />
                    <GasPriceCard title="Fast" price={props.gasPrices.fast} />
                </div>
            </>
        )
    }

    return <></>
}