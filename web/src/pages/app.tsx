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

      <footer className="footer">
        <small>
          <a href="https://twitter.com/wslyvh" className="text-muted">@wslyvh</a>
          <span className="ml-2 mr-2">|</span>
          <a href="https://github.com/wslyvh/ethgaswatch" className="text-muted">Github</a>
        </small>
    </footer>
    </div>
  );
}

export default App;
