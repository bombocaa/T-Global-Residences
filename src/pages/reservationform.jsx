import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom"; // To access the state passed from VirtualTour
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import "../styles/reservationForm.css";

const TermsModal = ({ isOpen, onClose, onAgree }) => (
  isOpen ? (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="terms-modal-title">
      <div className="modern-modal">
        <div className="modern-header">
          <div className="modal-title" id="terms-modal-title">Terms & Conditions</div>
          <button className="modal-close" aria-label="Close" onClick={onClose} tabIndex={0}>
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modern-body">
          <h3>Reservation Terms & Conditions</h3>
          <ol>
            <li>All reservations are subject to availability and confirmation.</li>
            <li>Payment must be made by cash within 2 days of reservation confirmation.</li>
            <li>Reservations are non-transferable and non-refundable after confirmation.</li>
            <li>Guests must comply with all property rules and regulations.</li>
            <li>Management reserves the right to cancel reservations for violations or false information.</li>
            <li>Personal data will be handled in accordance with our privacy policy.</li>
            <li>For questions, contact our support team before confirming your reservation.</li>
            <li>Failure to pay the reservation fee will automatically cancel your reservation.</li>
          </ol>
          <div style={{ marginTop: 24, textAlign: 'right' }}>
            <button className="modern-reserve-btn" onClick={onAgree} autoFocus>I Agree</button>
          </div>
        </div>
      </div>
    </div>
  ) : null
);

const ReservationForm = () => {
  const location = useLocation(); // Access the passed state
  const { room } = location.state || {}; // Extract room from passed state
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    tenants: "",
    room: room || "", // Set room to the selected room if available
  });

  const [agreed, setAgreed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!room) {
      setErrorMessage("Please select a room before proceeding.");
    }
  }, [room]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      setErrorMessage("You must agree to the Terms & Conditions.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.tenants || !formData.room) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "reservationForm"), {
        fullName: formData.name,
        email: formData.email,
        phoneNo: formData.phone,
        address: formData.address,
        tenantsNo: formData.tenants,
        room: formData.room,
      });

      setErrorMessage("");
      setShowSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        address: "",
        tenants: "",
        room: room,
      });
      setAgreed(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      setErrorMessage("Error submitting reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="reservation-form-container" style={{ position: 'relative' }}>
      <h2>Reservation Form</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>
          Full Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
          />
        </label>

        <label>
          Email Address
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            required
          />
        </label>

        <label>
          Phone Number
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
          />
        </label>

        <label>
          Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter your address"
            required
          />
        </label>

        <label>
          Number of Tenants
          <input
            type="number"
            name="tenants"
            value={formData.tenants}
            onChange={handleInputChange}
            placeholder="Enter number of tenants"
            min="1"
            required
          />
        </label>

        <label>
          Room
          <input
            type="text"
            name="room"
            value={formData.room}
            onChange={handleInputChange}
            placeholder="Room selected will appear here"
            required
            disabled
          />
        </label>

        <div className="terms-conditions">
          <input
            type="checkbox"
            id="terms"
            checked={agreed}
            onChange={e => {
              if (!agreed) setShowTermsModal(true);
              else setAgreed(false);
            }}
            required
          />
          <label htmlFor="terms" className="terms-text">
            I agree to the <span style={{ color: '#4e8d7c', cursor: 'pointer', textDecoration: 'underline' }} onClick={e => { e.preventDefault(); setShowTermsModal(true); }}>Terms & Conditions</span>.
          </label>
        </div>

        <button 
          type="submit" 
          className="submit-btn" 
          disabled={!agreed || isSubmitting || showSuccess}
        >
          {isSubmitting ? (
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span className="jimu-primary-loading" style={{ position: 'static', margin: 0, width: 20, height: 20 }}></span>
              Submitting…
            </span>
          ) : showSuccess ? (
            'Submitted! Please wait for confirmation via email.'
          ) : (
            'Submit Reservation'
          )}
        </button>
      </form>
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAgree={() => { setAgreed(true); setShowTermsModal(false); }}
      />
    </div>
  );
};

export default ReservationForm;
