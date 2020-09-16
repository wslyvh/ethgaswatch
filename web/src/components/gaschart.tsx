import React, { useState, useEffect } from 'react';
import { Alert, Loading } from '.';
import { TrendChartData } from '../types';
import { Line } from 'react-chartjs-2';

export const GasChart = () => {
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState(7);
    const [chartData, setChartData] = useState<any>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/trend?days=${timePeriod}`);
                const body = await response.json() as TrendChartData;
                
                const chartData = {
                    labels: body.labels,
                    datasets: [{
                        label: "Slow",
                        borderColor: "#FFFF9D",
                        borderWidth: "1",
                        data: body.slow
                    },
                    {
                        label: "Normal",
                        borderColor: "#FEDA6A",
                        borderWidth: "1",
                        data: body.normal,  
                    },
                    {
                        label: "Fast",
                        borderColor: "#CBA737",
                        borderWidth: "1",
                        data: body.fast,
                    },
                    {
                        label: "Instant",
                        borderColor: "#654100",
                        borderWidth: "1",
                        data: body.instant,
                    }],
                    options: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                };

                setChartData(chartData);
            } catch (ex) { 
                console.log("Couldn't retrieve gas chart data", ex);
            }

            setLoading(false);
        }
        
        asyncEffect();
    }, [timePeriod]);
    
    if (loading) { 
        return <Loading />
    }

    if (!chartData) { 
        return <Alert type="danger" message="Couldn't retrieve gas chart data." />
    } 

    return (
        <div className="mt-3">
            <h2>Daily average gas prices</h2>

            <div className="input-group input-group-sm col-6 col-sm-4 mb-3 float-right">
                <select className="custom-select" id="inputPeriodSelector" value={timePeriod} onChange={e => setTimePeriod(Number(e.target.value))}>
                    <option value={7}>Last week</option>
                    <option value={14}>Last 2 weeks</option>
                    <option value={30}>Last month</option>
                </select>
            </div>

            <div>
                <Line data={chartData} options={chartData.options} />
            </div>
        </div>
    );
}