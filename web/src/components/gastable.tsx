import React from 'react';
import { RecommendedGasPrices } from '../types';
import { GasTableRow } from './';

interface GasPriceTableProps { 
    sources: RecommendedGasPrices[]
}

export const GasTable = (props: GasPriceTableProps) => {

    let renderTableRows = props.sources.map((member: RecommendedGasPrices, id: number) => 
        <GasTableRow key={id} name={member.name} source={member.source} low={member.low} average={member.average} fast={member.fast} />
    );
    
    return (
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
    );
}