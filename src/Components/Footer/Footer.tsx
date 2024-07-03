//import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer-end'>
        <div className="curved-corners left"></div>
        <ul className="social-icons">
          <li><a href="#" className="fab fa-facebook-f"></a></li>
          <li><a href="#" className="fab fa-twitter"></a></li>
          <li><a href="#" className="fab fa-linkedin-in"></a></li>
          <li><a href="#" className="fab fa-instagram"></a></li>
        </ul>
        <div className="curved-corners right"></div>
      </div>
    </div>
  )
}

export default Footer;
