
import React from 'react';

export const Header = () => {
  return (
    <>
    <nav className="navbar navbar-expand navbar-dark">
      <a className="navbar-brand" href="/">
        <span role="img" aria-label="Fuel pump">⛽</span> <small className="text-muted">ETH Gas.watch</small>
      </a> 
      <div className="ml-auto mr-1">
        <ul className="navbar-nav text-right">
          <li className="nav-item active">
            <a className="nav-link" href="/stats">Stats</a>
          </li>
          <li className="nav-item active">
            <a className="nav-link" href="https://docs.ethgas.watch/">Developers</a>
          </li>
        </ul>
      </div>
    </nav>
    </>
  );
}