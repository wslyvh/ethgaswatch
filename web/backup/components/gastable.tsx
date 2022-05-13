import React from 'react';
import { RecommendedGasPrices } from '../types';
import { GasTableRow } from './';

interface GasPriceTableProps { 
    sources: RecommendedGasPrices[]
}

export const GasTable = (props: GasPriceTableProps) => {

    let renderTableRows = props.sources.map((member: RecommendedGasPrices, id: number) => 
        <GasTableRow key={id} data={member} />
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
                        <th scope="col">Instant</th>
                    </tr>
                </thead>
                <tbody>
                    {renderTableRows}
                </tbody>
            </table>
        </div>
    );
}