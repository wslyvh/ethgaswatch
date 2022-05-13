import React from 'react';
import { AlertStats, GasChart } from '../components';

function Stats() {
  return (
    <div>
      <AlertStats />
      <GasChart type="daily" />
      <GasChart type="hourly" />
    </div>
  );
}

export default Stats;
