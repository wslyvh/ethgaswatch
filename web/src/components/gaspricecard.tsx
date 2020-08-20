
import React from 'react';

interface GasPriceProps { 
    title: string
    price: number
}

export const GasPriceCard = (props: GasPriceProps) => {

    let waitTime = 0;
    if (props.title === "Fast") { 
        waitTime = 2;
    }
    if (props.title === "Normal") { 
        waitTime = 5;
    }
    if (props.title === "Slow") { 
        waitTime = 30;
    }

    return (
        <div className="card shadow-sm rounded">
            <h3 className="card-title">{props.title}</h3>
            <p className="card-text">
                {props.price} gwei <br/>
                <small className="text-muted">&lt;{waitTime} min</small>
            </p>            
        </div>
    )
}