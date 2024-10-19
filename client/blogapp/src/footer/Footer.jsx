import React from 'react';
import './Footer.css'; // Add CSS for your footer

function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-section">
        <h3>Information</h3>
        <ul>
          <li><a href="/pages">Pages</a></li>
          <li><a href="/our-team">Our Team</a></li>
          <li><a href="/features">Features</a></li>
          <li><a href="/pricing">Pricing</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Resources</h3>
        <ul>
          <li><a href="https://wikipedia.org">Wikipedia</a></li>
          <li><a href="https://reactjs.org/blog">React Blog</a></li>
          <li><a href="/terms-service">Terms of Service</a></li>
          <li><a href="/angular-dev">Angular Dev</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Help</h3>
        <ul>
          <li><a href="/signup">Sign Up</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/terms-service">Terms of Service</a></li>
          <li><a href="/privacy-policy">Privacy Policy</a></li>
        </ul>
      </div>
      <div className="footer-section">
        <h3>Contact Us</h3>
        <p>Contact us if need help with anything:</p>
        <p>+91 xxxxxxxxxx</p>
      </div>
    </footer>
  );
}

export default Footer;
