import React from 'react';
import { GasPrices } from '../components/gasprices';

function App() {
  return (
    <div>
      <header>
        <h1>ETH Gas Tracker</h1>
      </header>
      <div className="container">
        <GasPrices />
      </div>
    </div>
  );
}

export default App;
