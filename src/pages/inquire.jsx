import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore"; // Firestore functions
import { db } from "../firebase"; // Adjust path if your firebase.js is elsewhere
import "../styles/navbarvariant1.css";
import "../styles/inquire.css";

const Inquire = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState("");

  // Handle input changes and update form data
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, message } = formData;
    if (!name || !email || !phone || !message) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    setErrorMessage("");
    try {
      await addDoc(collection(db, "inquiries"), {
        fullName: name,
        email: email,
        phoneNo: phone,
        message: message,
        createdAt: new Date()
      });
      setSuccessMessage("Your inquiry has been submitted. We will get back to you soon.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (error) {
      setErrorMessage("Error submitting inquiry. Please try again.");
      console.error("Firestore error:", error);
    }
  };

  return (
    <div className="appointment-form-wrapper">
      <h1 className="inquire-title">Inquire Form</h1>
      <p className="inquire-subtitle">Please fill out the form below for any inquiries. We will respond as soon as possible.</p>

      <form className="inquire-form" onSubmit={handleSubmit}>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            placeholder="Your Phone Number"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            placeholder="Type your inquiry here..."
            value={formData.message}
            onChange={handleInputChange}
            required
            rows={4}
          />
        </div>

        <button type="submit" className="submit-btn">Submit Inquiry</button>
      </form>
    </div>
  );
};

export default Inquire;
