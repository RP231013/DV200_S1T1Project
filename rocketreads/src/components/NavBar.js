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
          {/* uses navlik to check if active, can then add css to active navLink */}
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active' : undefined} >Dashboard</NavLink></li>
            <li><NavLink to="/compare" className={({ isActive }) => isActive ? 'active' : undefined}>Compare</NavLink></li>
            <li><NavLink to="/timelines" className={({ isActive }) => isActive ? 'active' : undefined}>Timelines</NavLink></li>
        </ul>
        <p>SpaceXAPI</p>
    </nav>
  );
}

export default Navbar;