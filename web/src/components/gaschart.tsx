import React, { useState, useEffect } from 'react';
import { Alert, Loading } from '.';
import { TrendChartData } from '../types';
import { Line } from 'react-chartjs-2';

export const GasChart = () => {
    const [loading, setLoading] = useState(true);
    const [trendChartData, setTrendChartData] = useState<TrendChartData>();
    const [chartData, setChartData] = useState<any>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/trend?days=10`);
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

                setTrendChartData(body);
                setChartData(chartData);
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

    if (!chartData) { 
        return <Alert type="danger" message="Couldn't retrieve gas chart data." />
    } 

    return (
        <div>
            <Line data={chartData} options={chartData.options} />
        </div>
    );
}