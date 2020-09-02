import React from 'react';
import { Register } from '../components/';
import { GasPrices } from '../components/gasprices';

function App() {
  return (
    <div>
      <header>
        <h1><span role="img" aria-label="Fuel pump">⛽</span> ETH Gas.watch</h1>
      </header>

      <div className="container">
        <Register />
        <GasPrices />
      </div>

      <footer className="footer">
        <a href="https://www.producthunt.com/posts/ethereum-gas-watch" target="_blank" rel="noopener noreferrer">
          <img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=243131&amp;theme=dark" 
            alt="Ethereum Gas watch - An aggregated gas price feed, with alerts if the price drops" style={{ width: 125, height: 27}} width="125px" height="27px" />
        </a>
        <br/>

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
