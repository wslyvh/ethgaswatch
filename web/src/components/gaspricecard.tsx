
import React from 'react';

interface GasPriceProps { 
    title: string
    price: number
    wait: number
}

export const GasPriceCard = (props: GasPriceProps) => {
    return (
        <div className="card shadow-sm rounded">
            <h2 className="card-title">{props.title}</h2>
            <p className="card-text">{props.price} gwei &laquo; {props.wait}m</p>
        </div>
    )
}