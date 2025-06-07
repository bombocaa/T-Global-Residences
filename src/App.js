import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/home";
import Virtual from "./pages/virtualtour";
import Inquire from "./pages/inquire";
import ReserveForm from "./pages/reservationform"; // Ensure this is correctly imported
import Navbar from "./components/navbar";
import NavbarVariant1 from "./components/navbarvariant1";
import Footer from "./components/footer";
import ChatbotHead from './components/chatbothead';
import RoomAvailability from "./pages/roomavailability";
import BackToTop from "./components/BackToTop";
import ScrollToTop from "./components/ScrollToTop";
import './App.css';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Layout />
      <ChatbotHead />
      <BackToTop />
    </Router>
  );
}

const Layout = () => {
  const location = useLocation();
  const path = location.pathname;

  const showVariantNavbar = ["/virtualTour", "/inquire", "/reservation-form", "/room-availability"].includes(path);

  return (
    <>
      {/* Navbar */}
      {showVariantNavbar ? <NavbarVariant1 /> : <Navbar />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/virtualTour" element={<Virtual />} />
        <Route path="/inquire" element={<Inquire />} />
        <Route path="/reservation-form" element={<ReserveForm />} /> {/* Path corrected */}
        <Route path="/room-availability" element={<RoomAvailability />} />
      </Routes>

      {/* Footer */}
      <Footer />
    </>
  );
};

export default App;
