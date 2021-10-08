import React, { useState, useEffect } from 'react';
import { Alert, Loading } from '.';
import { HeatMapGrid } from "react-grid-heatmap";

interface Props { 

}

export const Heatmap = (props: Props) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<any>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/average`);
                const body = await response.json()

                if (body === null) { 
                    console.log("Error retrieving gas chart data");
                    return;
                }

                setData(body)
            } catch (ex) { 
                console.log("Couldn't retrieve gas chart data", ex);
            }

            setLoading(false);
        }
        
        asyncEffect();
    }, []);
    
    if (loading) { 
        return <Loading />
    }

    if (!data) { 
        return <Alert type="danger" message="Couldn't retrieve gas chart data." />
    } 

    console.log('GAS DATA', data)

    return (
        <div className="mt-4 mb-4">
            <h2 className="text-capitalize">Average gas prices</h2>

            <div>
                <HeatMapGrid
                    data={data.data}
                    xLabels={data.x}
                    yLabels={data.y}
                    cellRender={(x, y, value) => (
                        <div>{value}</div>
                    )}
                    xLabelsStyle={(index) => ({
                        fontSize: ".65rem"
                    })}
                    yLabelsStyle={() => ({
                        fontSize: ".65rem",
                    })}
                    cellStyle={(_x, _y, ratio) => ({
                        border: 0,
                        borderRadius: 0,
                        background: `rgb(255, 51, 51, ${ratio})`,
                        color: 'white'
                    })}
                    cellHeight="1.5rem"
                    xLabelsPos="bottom"
                />
            </div>
        </div>
    );
}