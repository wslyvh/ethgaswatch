import React from 'react';

interface AlertCardProps { 
    title: string
    description?: string
    value: number
}

export const AlertCard = (props: AlertCardProps) => {

    function icon(title: string): string { 
        if (title === "Alerts") { 
            return "🛎️";
        }
        if (title === "Users") { 
            return "👤";
        }
        if (title === "Average") { 
            return "➗";
        }
        if (title === "Mode") { 
            return "✖️";
        }

        return "";
    }

    return (
        <div className="card text-center m-2">
            <div className="card-body">
                <h3 className="card-title text-muted text-uppercase">{props.title}</h3>
                <h4 className="card-price">{props.value} <span className="period">{props.description}</span></h4>
                <div>
                    <span className="card-icon" role="img" aria-label={props.title}>{icon(props.title)}</span>
                </div>
            </div>
        </div>
    );
}