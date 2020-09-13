
import React from 'react';
import { GasPriceValues } from '../types';

interface GasPriceProps { 
    title: string
    values: GasPriceValues
}

export const GasPriceCard = (props: GasPriceProps) => {

    function waitTime(title: string): string { 
        if (title === "Instant") { 
            return "few secs";
        }
        if (title === "Fast") { 
            return "<2 min";
        }
        if (title === "Normal") { 
            return "<5 min";
        }
        if (title === "Slow") { 
            return "<30 min";
        }

        return "";
    }

    function speedIcon(title: string): string { 
        if (title === "Instant") { 
            return "⚡";
        }
        if (title === "Fast") { 
            return "🚀";
        }
        if (title === "Normal") { 
            return "⏳";
        }
        if (title === "Slow") { 
            return "🐌";
        }

        return "";
    }

    if (!props.values) { 
        return <></>
    }
    
    return (
        
        <div className="card text-center m-2">
          <div className="card-body">
            <h3 className="card-title text-muted text-uppercase">{props.title}</h3>
            <h4 className="card-price">{props.values.gwei} <span className="period">gwei</span></h4>
            <h5>${props.values.usd}</h5>
            <h5 className="text-muted">{waitTime(props.title)}</h5>
            <div>
                <span className="card-icon" role="img" aria-label={props.title}>{speedIcon(props.title)}</span>
            </div>
          </div>
        </div>
    )
}