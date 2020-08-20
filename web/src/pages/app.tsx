import React from 'react';
import { GasTable, Register } from '../components/';

function App() {
  return (
    <div>
      <header>
        <h1><span role="img" aria-label="Fuel pump">⛽</span> ETH Gas.watch</h1>
      </header>
      <div className="container">
        <Register />
        <GasTable />
      </div>
    </div>
  );
}

export default App;
