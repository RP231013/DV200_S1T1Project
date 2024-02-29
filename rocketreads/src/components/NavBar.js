import React from 'react';
import { NavLink } from 'react-router-dom';
import './NavBar.css'; 
import Logo from '../assets/rrlogo.svg';


function Navbar() {
  return (
    <nav className="navbar">
        <img src={Logo} alt="Logo" />
        <h1>Rocket Readouts</h1>
        <ul className="navbar-nav">
            <li><NavLink to="/" activeClassName="active" >Dashboard</NavLink></li>
            <li><NavLink to="/compare" activeClassName="active">Compare</NavLink></li>
            <li><NavLink to="/timelines" activeClassName="active">Timelines</NavLink></li>
        </ul>
        <p>SpaceXAPI</p>
    </nav>
  );
}

export default Navbar;