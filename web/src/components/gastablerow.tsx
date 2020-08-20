import React from 'react';
import { RecommendedGasPrices } from '../types';

export const GasTableRow = (props: RecommendedGasPrices) => {

    let renderSource = <></>
    if (props.source) { 
        renderSource = (
            <a href={props.source} target="_blank" rel="noopener noreferrer" className="float-right">
                <small><span role="img" aria-label="Information">ℹ️</span></small>
            </a>
        )
    }

    return (
        <tr>
            <th scope="row" className="table-index">
                {props.name} {renderSource}
            </th>
            <td>{props.low}</td>
            <td>{props.average}</td>
            <td>{props.fast}</td>
        </tr>
    )
}