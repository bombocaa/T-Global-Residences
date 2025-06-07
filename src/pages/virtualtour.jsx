import React, { useState, useEffect } from "react";
import "../styles/virtual.css";
import "../styles/navbarvariant1.css";
import arQrCode from '../assets/AR-qr code.png';

const VirtualTour = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tourStarted, setTourStarted] = useState(false);

  // Add device motion event listener
  useEffect(() => {
    const handleDeviceMotion = (e) => {
      const iframe = document.getElementById("tour-embeded");
      if (iframe) {
        iframe.contentWindow.postMessage({
          type: "devicemotion",
          deviceMotionEvent: {
            acceleration: {
              x: e.acceleration.x,
              y: e.acceleration.y,
              z: e.acceleration.z
            },
            accelerationIncludingGravity: {
              x: e.accelerationIncludingGravity.x,
              y: e.accelerationIncludingGravity.y,
              z: e.accelerationIncludingGravity.z
            },
            rotationRate: {
              alpha: e.rotationRate.alpha,
              beta: e.rotationRate.beta,
              gamma: e.rotationRate.gamma
            },
            interval: e.interval,
            timeStamp: e.timeStamp
          }
        }, "*");
      }
    };

    window.addEventListener("devicemotion", handleDeviceMotion);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("devicemotion", handleDeviceMotion);
    };
  }, []);

  return (
    <div className="virtual-tour-container">
      <div className="tour-header">
        <h1>Explore T-Global Elite Residences</h1>
        <p>Experience living through our virtual tour. From lobby to top floor, discover your future home.</p>
      </div>

      <div className="tour-viewer">
        <div className="tour-iframe-container">
          {isLoading && (
            <div className="loading-overlay">
              <div className="loading-spinner"></div>
              <p>Loading Virtual Tour...</p>
            </div>
          )}
          
          {!tourStarted && (
            <div className="tour-starter">
              <div className="tour-starter-content">
                <h2>Welcome to T-Global Elite Residences</h2>
                <p>Step into the best place to live around U-belt. Explore our spaces and amenities.</p>
                <button 
                  className="start-tour-btn"
                  onClick={() => setTourStarted(true)}
                >
                  Begin Tour
                </button>
              </div>
            </div>
          )}

          <iframe 
            id="tour-embeded" 
            title="T-Global Residences Virtual Tour"
            src="https://tour.panoee.net/iframe/682ecaa358363143fbbfe06d" 
            frameBorder="0" 
            width="100%" 
            height="100%" 
            scrolling="no" 
            allowvr="yes" 
            allow="vr; xr; accelerometer; gyroscope; autoplay;" 
            allowFullScreen="true" 
            webkitallowfullscreen="true" 
            mozallowfullscreen="true" 
            loading="eager"
            style={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              width: '100%', 
              height: '100%',
              filter: tourStarted ? 'none' : 'blur(8px)'
            }}
            onLoad={() => setIsLoading(false)}
          ></iframe>
        </div>
      </div>

      <div className="brochure-section">
        <div className="brochure-container">
          <h3>Property Brochure</h3>
          <p>Download our comprehensive brochure to learn more about T-Global Elite Residences</p>
          <div className="brochure-actions">
            <a 
              href="/brochure/t-global-elite-residences.pdf" 
              download 
              className="brochure-btn download-btn"
            >
              Download Brochure
            </a>
            <a 
              href="/brochure/t-global-elite-residences.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="brochure-btn view-btn"
            >
              View Brochure
            </a>
          </div>
        </div>
      </div>

      <div className="ar-experience-section">
        <div className="ar-content">
          <div className="ar-header">
            <h2>Augmented Reality Experience</h2>
            <p>Experience T-Global Elite Residences in a whole new dimension</p>
          </div>

          <div className="ar-qr-section">
            <img 
              src={arQrCode}
              alt="AR QR Code" 
              className="ar-qr-image"
            />
            <p className="ar-qr-hint">Scan with your phone's camera to view in AR</p>
          </div>

          <h2>Experience Your Future Home in 3D & AR</h2>
          <p className="ar-intro">Transform your space exploration with our cutting-edge 3D and Augmented Reality technology. See your future home come to life right before your eyes.</p>
          
          <div className="ar-benefits">
            <div className="ar-benefit">
              <h3>Immersive 3D Room View</h3>
              <p>Walk through your future space in stunning 3D detail. Experience every corner of the room.</p>
            </div>
            <div className="ar-benefit">
              <h3>Interactive AR Features</h3>
              <p>Place the virtual room in your actual space and walk through it. Adjust the size to match your space perfectly and experience the layout in real-time.</p>
            </div>
          </div>

          <div className="ar-cta">
            <div className="ar-steps">
              <h3>Start Your AR Experience</h3>
              <ol>
                <li>
                  <span className="step-number">1</span>
                  <span className="step-text">Open your phone's camera app</span>
                </li>
                <li>
                  <span className="step-number">2</span>
                  <span className="step-text">Point it at the QR code above</span>
                </li>
                <li>
                  <span className="step-number">3</span>
                  <span className="step-text">Tap the button to launch AR</span>
                </li>
              </ol>
            </div>
            <div className="ar-features">
              <div className="feature-tag">
                <span>Works on iOS and Android</span>
              </div>
              <div className="feature-tag">
                <span>No app download required</span>
              </div>
              <div className="feature-tag">
                <span>Instant access to AR experience</span>
              </div>
              <div className="feature-tag">
                <span>High-quality 3D models</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
