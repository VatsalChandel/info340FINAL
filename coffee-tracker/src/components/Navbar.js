import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">

      <ul className="navbar-list">

        <li className="navbar-item">
          <Link to="/" className="navbar-link">
            <span className="navbar-label">Home</span>
          </Link>
        </li>

        <li className="navbar-item">
          <Link to="/go-to-list" className="navbar-link">
            <span className="navbar-label">Go-To List</span>
          </Link>

        </li>
        <li className="navbar-item">
          <Link to="/map" className="navbar-link">
            <span className="navbar-label">Map</span>
          </Link>

        </li>
        <li className="navbar-item">
          <Link to="/profile" className="navbar-link">
            <span className="navbar-label">Profile</span>
          </Link>
        </li>

      </ul>
    </nav>
  );
};

export default Navbar;
