//import React from 'react';
import "./Header.css";
import logo from "../../Components/Assets/logo.png";

const Navbar = () => {

  return (
    <div className='header'>
      <div className='navbar'>
        <img src={logo} alt="" />
        <ul className="nav-menu">
          <li>Home</li>
        </ul>
        <div className="nav-connect">Acessar</div>
      </div>
    </div>
  )
}

export default Navbar;
