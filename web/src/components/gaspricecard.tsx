
import React from 'react';

interface GasPriceProps { 
    title: string
    price: number
    wait: number
}

export const GasPriceCard = (props: GasPriceProps) => {
    return (
        <div className="card project-card shadow-sm bg-white rounded">
            <h4 className="card-title">{props.title}</h4>
            <p className="card-text">{props.price} ~{props.wait}m</p>
        </div>
    )
}