import React from 'react';
import { GasPrices } from '../components/gasprices';
import { Register } from '../components/register';

function App() {
  return (
    <div>
      <header>
        <h1><span role="img" aria-label="Fuel pump">⛽</span> ETH Gas.watch</h1>
      </header>
      <div className="container">
        <GasPrices />
        <Register />
      </div>
    </div>
  );
}

export default App;
