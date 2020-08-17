
import React, { useEffect, useState } from 'react';
import { Loading } from './loading';
import { ErrorAlert } from './error';
import { fromGasStation, fromEtherscan, fromGasNow } from '../services/GasService';
import { RecommendedGasPrices } from '../types';
import { GasPricesRow } from './gaspricesrow';

export const GasPrices = () => {
    const [loading, setLoading] = useState(true);
    const [gasstationPrices, setGasstationPrices] = useState<RecommendedGasPrices>();
    const [etherscanPrices, setEtherscanPrices] = useState<RecommendedGasPrices>();
    const [gasnowPrices, setGasnowPrices] = useState<RecommendedGasPrices>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const prices = await fromGasStation();
                setGasstationPrices(prices);
            } catch (ex) { 
                console.log("GASSTATION", ex);
            }
            try {
                const prices = await fromEtherscan();
                setEtherscanPrices(prices);
            } catch (ex) { 
                console.log("ETHERSCAN", ex);
            }
            try {
                const prices = await fromGasNow();
                setGasnowPrices(prices);
            } catch (ex) { 
                console.log("GASNOW", ex);
            }

            setLoading(false);
        }
        
        asyncEffect();
    }, []);

    if (loading) { 
        return <Loading />
    } 

    if (!gasstationPrices && !etherscanPrices && !gasnowPrices) { 
        return <ErrorAlert message="Couldn't retrieve gas prices." />
    } 

    return (
        <div>
            <GasPricesRow source={"ETH Gas Station"} gasPrices={gasstationPrices} />
            <GasPricesRow source={"Etherscan"} gasPrices={etherscanPrices} />
            <GasPricesRow source={"GAS NOW"} gasPrices={gasnowPrices} />
        </div>
    )
}