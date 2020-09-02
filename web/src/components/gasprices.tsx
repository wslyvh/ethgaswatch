import React, { useState, useEffect } from 'react';
import { GasData  } from '../types';
import { Alert, GasPriceRow, Loading } from './';
import { GasTable } from './gastable';

export const GasPrices = () => {
    const [loading, setLoading] = useState(true);
    const [gasData, setGasData] = useState<GasData>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/gas`);
                const body = await response.json() as GasData;

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
            <GasPriceRow data={gasData.data} />
            <GasTable sources={gasData.sources} />
        </>
    );
}