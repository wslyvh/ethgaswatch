import React from 'react';
import { AlertStats, GasChart } from '../components';

function Stats() {
  return (
    <div className="container">
      <AlertStats />
      <GasChart />
    </div>
  );
}

export default Stats;
