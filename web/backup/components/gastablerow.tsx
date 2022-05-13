import React from 'react';
import { RecommendedGasPrices } from '../types';

interface GasTableRowProps { 
    data: RecommendedGasPrices
}

export const GasTableRow = (props: GasTableRowProps) => {

    let renderSource = <></>
    if (props.data.source) { 
        renderSource = (
            <a href={props.data.source} target="_blank" rel="noopener noreferrer" className="float-right">
                <small><span role="img" aria-label="Information">ℹ️</span></small>
            </a>
        )
    }

    return (
        <tr>
            <th scope="row" className="table-index">
                {props.data.name} {renderSource}
            </th>
            <td>{props.data.slow || "-"}</td>
            <td>{props.data.standard || "-"}</td>
            <td>{props.data.fast || "-"}</td>
            <td>{props.data.instant || "-"}</td>
        </tr>
    )
}