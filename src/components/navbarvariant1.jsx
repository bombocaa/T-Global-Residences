import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbarvariant1.css"; 
import logo from "../assets/logo_navbar.png";

const NavbarVariant1 = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(prev => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  const scrollToSection = (sectionId) => {
    closeMenu();

    const scroll = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (location.pathname !== "/") {
      navigate("/"); 
      setTimeout(scroll, 100);
    } else {
      scroll();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar-variant-1" ref={menuRef}> {/* Change class to apply variant 1 styles */}
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>

      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><button onClick={() => scrollToSection("about-section")} className="nav-btn-link-1">About</button></li>
        <li><button onClick={() => scrollToSection("maps-container")} className="nav-btn-link-1">Location</button></li>
        <li><Link to="/virtualTour" onClick={closeMenu}>Virtual Tour/AR</Link></li>
        <li><Link to="/room-availability" onClick={closeMenu}>Room Availability</Link></li>
        <li><Link to="/inquire" className="schedule-btn" onClick={closeMenu}>Inquire Now</Link></li>
      </ul>
    </nav>
  );
};

export default NavbarVariant1;
