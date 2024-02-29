import React from 'react';
import './NavBar.css'; 
import Logo from '../assets/rrlogo.svg';

function Navbar() {
  return (
    <nav className="navbar">
        <img src={Logo} alt="Logo" />
        <h1>Rocket Readouts</h1>
        <ul className="navbar-nav">
            <li><a className='active' href="#home">Dashboard</a></li>
            <li><a href="#about">Compare</a></li>
            <li><a href="#services">Timelines</a></li>
        </ul>
        <p>SpaceXAPI</p>
    </nav>
  );
}

export default Navbar;