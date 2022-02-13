import React from 'react';
import { Register, GasPrices} from '../components';
import { Heatmap } from '../components/heatmap';

function Home() {
  return (
    <div>
      {/* <Register /> */}
      <GasPrices />
      <Heatmap />
    </div>
  );
}

export default Home;
