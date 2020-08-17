
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
                <h4>{props.source}</h4>
                <div className="card-columns">
                    <GasPriceCard title="Low" price={props.gasPrices.low} wait={props.gasPrices.lowWait} />
                    <GasPriceCard title="Average" price={props.gasPrices.average} wait={props.gasPrices.averageWait} />
                    <GasPriceCard title="Fast" price={props.gasPrices.fast} wait={props.gasPrices.fastWait} />
                </div>
            </>
        )
    }

    return <></>
}