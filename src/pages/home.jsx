import React from "react";
import "../styles/home.css";
import aboutImage from "../assets/about.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faShieldAlt, faMapMarkerAlt, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Home = () => {
  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Your Home Away From Home</h1>
          <p>Modern living spaces in the heart of Manila's educational district</p>
          <a href="#about-section" className="cta-button">Discover More</a>
        </div>
      </section>

      {/* About Section */}
      <section className="about" id="about-section">
        <div className="about-content">
          <div className="about-text">
            <h2>About T-Global</h2>
            <p>
              Experience modern living at its finest. Our semi-furnished units offer the perfect blend of comfort and convenience, 
              just steps away from major universities, review centers, and institutions. With 24/7 security and premium amenities, 
              we create a space where you can focus on what matters most.
            </p>
            <div className="features">
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faHome} />
                </div>
                <h3>Semi-Furnished Units</h3>
                <p>Ready to move in with essential amenities</p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faShieldAlt} />
                </div>
                <h3>24/7 Security</h3>
                <p>Round-the-clock safety and surveillance</p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </div>
                <h3>Prime Location</h3>
                <p>Walking distance to major universities</p>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <FontAwesomeIcon icon={faGraduationCap} />
                </div>
                <h3>Near Review Centers</h3>
                <p>Convenient access to top review centers</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src={aboutImage} alt="T-Global Residences" />
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="location" id="maps-container">
        <div className="location-content">
          <h2>Our Location</h2>
          <p>
            Strategically situated in the heart of Manila, T-Global Elite Residences offers 
            the perfect balance of urban convenience and peaceful living. Our prime location provides 
            easy access to major universities, review centers, and essential amenities.
          </p>
          <div className="map-container">
            <iframe
              title="T-Global Residences Location"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d16790.946303553013!2d120.990673!3d14.604077!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9fed54bbe2f%3A0x2db0a4ccf3e3c5b2!2sTGlobal%20Elite%20Residences!5e1!3m2!1sen!2sph!4v1744997317308!5m2!1sen!2sph"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

