import React from 'react';
import { AlertStats } from '../components';

function Stats() {
  return (
    <div className="container">
      { /* 
          Cards: Total Registrations/alerts. Unique addresses. 
          Cards: Avg. Mode 
          Charts: Daily of last 30 days (what are cheapest days)
          Charts: Hourly of last 24-72 hours (what are cheapest hours) 
      */ }

      <AlertStats />
    </div>
  );
}

export default Stats;
