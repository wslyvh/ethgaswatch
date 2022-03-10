import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../pages/home';
import Stats from '../pages/stats';
import Data from '../pages/data';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/index.css';
import { Footer, Header } from '../components';
import Privacy from '../pages/privacy';

function Main() {
    return (
        <>
            <Header />

            <div className="container">
                <div className="alert alert-warning m-3" role="alert">
                    If you enjoy using ETH Gas.watch? Please support my work at <a href="https://gitcoin.co/grants/4143/wslyvh-useweb3-ethgas-tokenlog-more" className="alert-link">Gitcoin Grants</a>. Even a small donation can go a long way 💰
                </div>
                <div className="alert alert-info m-3" role="alert">
                    NOTE: ETHGas.watch is migrating it's service. Visit <a href='https://www.useweb3.xyz/gas'>useWeb3 Gas tracker</a> or follow <a href='https://twitter.com/wslyvh'>@wslyvh</a> for updates.
                </div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/"><Home /></Route>
                        <Route exact path="/data"><Data /></Route>
                        <Route exact path="/stats"><Stats /></Route>
                        <Route exact path="/privacy"><Privacy /></Route>
                        <Route exact path='/docs' component={() => {
                            window.location.href = 'https://docs.ethgas.watch/';
                            return null;
                        }} />
                        <Redirect to="/" />
                    </Switch>
                </BrowserRouter>

                <Footer />
            </div>

        </>
    );
}

export default Main;
