import React from 'react';
import { GasPrices } from '../components/gasprices';

function App() {
  return (
    <div>
      <header>
        <h1><span role="img" aria-label="Fuel pump">⛽</span> ETH Gas Tracker</h1>
      </header>
      <div className="container">
        <GasPrices />
      </div>
    </div>
  );
}

export default App;
