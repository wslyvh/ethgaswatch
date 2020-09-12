import React, { useState, useEffect } from 'react';
import { GasPriceData  } from '../types';
import { TimestampToTimeAgo } from '../utils/parse';
import { Alert, GasPriceRow, Loading } from './';
import { GasTable } from './gastable';

export const GasPrices = () => {
    const [loading, setLoading] = useState(true);
    const [gasData, setGasData] = useState<GasPriceData>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/gas`);
                const body = await response.json() as GasPriceData;

                setGasData(body);
            } catch (ex) { 
                console.log("Couldn't retrieve gas prices", ex);
            }

            setLoading(false);
        }
        
        asyncEffect();
    }, []);
    
    if (loading) { 
        return <Loading />
    }

    if (!gasData || gasData.sources.length < 1) { 
        return <Alert type="danger" message="Couldn't retrieve gas prices." />
    } 

    return (
        <>
            <GasPriceRow data={gasData} />
            <div className="float-right">
                <small className="text-muted">Last update: {TimestampToTimeAgo(gasData.lastUpdated)}</small>
            </div>
            <br/>
            <GasTable sources={gasData.sources} />
        </>
    );
}