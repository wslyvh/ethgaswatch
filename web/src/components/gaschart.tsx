import React, { useState, useEffect } from 'react';
import { Alert, Loading } from '.';
import { TrendChartData } from '../types';
import { Line } from 'react-chartjs-2';

interface GasChartProps { 
    type: "daily" | "hourly"
}

export const GasChart = (props: GasChartProps) => {
    const defaultTimePeriod = props.type === "daily" ? 7 : 24
    const [loading, setLoading] = useState(true);
    const [timePeriod, setTimePeriod] = useState(defaultTimePeriod);
    const [chartData, setChartData] = useState<any>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                let body: TrendChartData | null = null;
                if (props.type === "daily") { 
                    const response = await fetch(`/.netlify/functions/trend?days=${timePeriod}`);
                    body = await response.json() as TrendChartData;
                }
                if (props.type === "hourly") { 
                    const response = await fetch(`/.netlify/functions/trend?hours=${timePeriod}`);
                    body = await response.json() as TrendChartData;
                }
                if (body === null) { 
                    console.log("Error retrieving gas chart data");
                    return;
                }

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
    }, [timePeriod, props.type]);
    
    if (loading) { 
        return <Loading />
    }

    if (!chartData) { 
        return <Alert type="danger" message="Couldn't retrieve gas chart data." />
    } 

    const dailyOptions = (<>
        <option value={7}>Last week</option>
        <option value={14}>Last 2 weeks</option>
        <option value={30}>Last month</option>
    </>);

    const hourlyOptions = (<>
        <option value={24}>Last 24 hours</option>
        <option value={72}>Last 3 days</option>
        <option value={168}>Last week</option>
    </>);

    return (
        <div className="mt-3">
            <h2 className="text-capitalize">{props.type} average gas prices</h2>

            <div className="input-group input-group-sm col-6 col-sm-4 mb-3 float-right">
                <select className="custom-select" id="inputPeriodSelector" value={timePeriod} onChange={e => setTimePeriod(Number(e.target.value))}>
                    {props.type === "daily" ? dailyOptions : <></>}
                    {props.type === "hourly" ? hourlyOptions : <></>}
                </select>
            </div>

            <div>
                <Line data={chartData} options={chartData.options} />
            </div>
        </div>
    );
}