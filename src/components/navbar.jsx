import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo_navbar.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const [blurStyle, setBlurStyle] = useState({});

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

    // Gradual blur/opacity on scroll (only on home page)
    const handleScroll = () => {
      if (window.location.pathname === "/") {
        const y = Math.min(window.scrollY, 120);
        const blur = (y / 120) * 10; // up to 10px blur
        const opacity = 0.1 + (y / 120) * 0.75; // from 0.1 to 0.85
        setBlurStyle({
          background: `rgb(20 49 19 / ${opacity * 75}%)`,
          backdropFilter: `blur(${blur}px)`,
          transition: 'background 0.3s, backdrop-filter 0.3s'
        });
      } else {
        setBlurStyle({});
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Compute navbar class for background
  const isHome = location.pathname === "/";
  const navbarClass = `navbar${isHome ? "" : " navbar-solid"}`;

  return (
    <nav className={navbarClass} ref={menuRef} style={isHome ? blurStyle : {}}>
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

export default Navbar;
