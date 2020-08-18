
import React from 'react';

interface GasPriceProps { 
    title: string
    price: number
    wait: number
}

export const GasPriceCard = (props: GasPriceProps) => {
    return (
        <div className="card shadow-sm rounded">
            <h3 className="card-title">{props.title}</h3>
            <p className="card-text">{props.price} gwei</p>
        </div>
    )
}