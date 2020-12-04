import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import Home from '../pages/home';
import Stats from '../pages/stats';
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
                    Enjoy ETH Gas.watch? Support us on <a href="https://gitcoin.co/grants/1175/eth-gaswatch" className="alert-link">Gitcoin Grants</a> round 8. Even a small donation can go a long way 💰
                </div>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/"><Home /></Route>
                        <Route exact path="/stats"><Stats /></Route>
                        <Route exact path="/privacy"><Privacy /></Route>
                        <Route exact path='/docs' component={() => { 
                            window.location.href = 'https://docs.ethgas.watch/'; 
                            return null;
                        }}/>
                        <Redirect to="/" />
                    </Switch>
                </BrowserRouter>
                
                <Footer />
            </div>

        </>
    );
}

export default Main;
