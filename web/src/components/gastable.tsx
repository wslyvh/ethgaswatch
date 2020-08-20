import React, { useState, useEffect } from 'react';
import { RecommendedGasPrices } from '../types';
import { ErrorAlert, GasPriceRow, GasTableRow, Loading } from './';

export const GasTable = () => {
    const [loading, setLoading] = useState(true);
    const [averagePrice, setAveragePrice] = useState<RecommendedGasPrices>();
    const [gasprices, setGasPrices] = useState<RecommendedGasPrices[]>([]);

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/prices`);
                const body = await response.json() as RecommendedGasPrices[];
                const avg = body.find(i => i.name === "Average");

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
        return <ErrorAlert message="Couldn't retrieve gas prices." />
    } 

    let renderAveragePrice = <></>
    if (averagePrice) { 
        renderAveragePrice = <GasPriceRow source={"Average Price"} gasPrices={averagePrice} />
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
                        <th scope="col">Low</th>
                        <th scope="col">Average</th>
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