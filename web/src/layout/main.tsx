import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../pages/home';
import Stats from '../pages/stats';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/index.css';

function Main() {
    return (
        <div>
            <header>
                <h1><span role="img" aria-label="Fuel pump">⛽</span> ETH Gas.watch</h1>
            </header>

            <BrowserRouter>
                <Switch>
                    <Route exact path="/"><Home /></Route>
                    <Route exact path="/stats"><Stats /></Route>
                    <Redirect to="/" />
                </Switch>
            </BrowserRouter>

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

export default Main;
