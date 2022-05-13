import React from 'react';
import { GasPrices} from '../components';
import { Heatmap } from '../components/heatmap';

function Home() {
  return (
    <div>
      <GasPrices />
      <Heatmap />
    </div>
  );
}

export default Home;
