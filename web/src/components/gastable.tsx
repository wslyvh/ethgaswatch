import React, { useState, useEffect } from 'react';
import { RecommendedGasPrices } from '../types';
import { Alert, GasPriceRow, GasTableRow, Loading } from './';
import { AVERAGE_NAME } from '../utils/constants';

export const GasTable = () => {
    const [loading, setLoading] = useState(true);
    const [averagePrice, setAveragePrice] = useState<RecommendedGasPrices>();
    const [gasprices, setGasPrices] = useState<RecommendedGasPrices[]>([]);

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/prices`);
                const body = await response.json() as RecommendedGasPrices[];
                const avg = body.find(i => i.name === AVERAGE_NAME);

                setAveragePrice(avg);
                setGasPrices(body);
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

    if (gasprices.length < 1) { 
        return <Alert type="danger" message="Couldn't retrieve gas prices." />
    } 

    let renderAveragePrice = <></>
    if (averagePrice) { 
        renderAveragePrice = <GasPriceRow name={averagePrice.name} source={averagePrice.source} fast={averagePrice.fast} average={averagePrice.average} low={averagePrice.low} />
    }

    let renderTableRows = gasprices.map((member: RecommendedGasPrices, id: number) => 
        <GasTableRow key={id} name={member.name} source={member.source} low={member.low} average={member.average} fast={member.fast} />
    );
    
    return (
        <>
        {renderAveragePrice}

        <div className="table-responsive mt-3">
            <table className="table table-sm gastable">
                <thead className="thead-secondary">
                    <tr>
                        <th scope="col"></th>
                        <th scope="col">Slow</th>
                        <th scope="col">Normal</th>
                        <th scope="col">Fast</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows}
                </tbody>
            </table>
        </div>
        </>
    );
}