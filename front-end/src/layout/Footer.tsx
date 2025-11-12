import { Link } from "react-router-dom";
import "../css/Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>CARESLOT</h3>
            <p>
              Your trusted partner for quality healthcare services. We connect
              you with the best doctors and medical professionals.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/doctors">Find Doctors</Link>
              </li>
              <li>
                <Link to="/service">Services</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>
                <a href="#cardiology">Cardiology</a>
              </li>
              <li>
                <a href="#neurology">Neurology</a>
              </li>
              <li>
                <a href="#pediatrics">Pediatrics</a>
              </li>
              <li>
                <a href="#orthopedics">Orthopedics</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>📍 123 Medical Center Drive</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ careslot@gmail.com</p>
              <p>🕒 24/7 Emergency Services</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; 2024 HealthCare+. All rights reserved. | Privacy Policy |
            Terms of Service
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
