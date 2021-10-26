import React, { useState, useEffect } from 'react';
import { AlertsData  } from '../types';
import { Alert, AlertCard, Loading } from '.';

export const AlertStats = () => {
    const [loading, setLoading] = useState(true);
    const [alertsData, setAlertsData] = useState<AlertsData>();

    useEffect(() => {
        async function asyncEffect() {
            try {
                const response = await fetch(`/.netlify/functions/alerts`);
                const body = await response.json() as AlertsData;

                setAlertsData(body);
            } catch (ex) { 
                console.log("Couldn't retrieve alert data", ex);
            }

            setLoading(false);
        }
        
        asyncEffect();
    }, []);
    
    if (loading) { 
        return <Loading />
    }

    if (!alertsData) { 
        return <Alert type="danger" message="Couldn't retrieve alert data." />
    } 

    return (
        <div className="card-deck mt-5">
            <AlertCard title="Alerts" value={alertsData.alerts} />
            <AlertCard title="Users" value={alertsData.unique} />
            <AlertCard title="Average" description="gwei" value={alertsData.average} />
        </div>
    );
}