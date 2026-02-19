import { useEffect, useState } from "react";
import QRCode from "qrcode";
import "./AppointmentLetter.css";

export default function AppointmentLetter({ booking, close }) {

  const [qrImage, setQrImage] = useState("");

  useEffect(() => {
    if (booking?.qr_token) {
      QRCode.toDataURL(
        `http://localhost:3000/verify/${booking.qr_token}`
      ).then(url => setQrImage(url));
    }
  }, [booking]);

  if (!booking) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  };

  return (
    <div className="letter-overlay">
      <div className="appointment-letter">

        {/* Header */}
        <div className="letter-header">
          <h1>Pranamithra Hospital</h1>
          <p>Appointment Confirmation Letter</p>
        </div>

        {/* Patient Info */}
        <div className="letter-section">
          <h3>Patient Information</h3>

          <div className="info-row">
            <span>Name</span>
            <span>{booking.customer_name}</span>
          </div>

          <div className="info-row">
            <span>Email</span>
            <span>{booking.email}</span>
          </div>

          <div className="info-row">
            <span>Phone</span>
            <span>{booking.phone}</span>
          </div>
        </div>

        {/* Doctor Info */}
        <div className="letter-section">
          <h3>Doctor Information</h3>

          <div className="info-row">
            <span>Doctor</span>
            <span>{booking.doctor_name}</span>
          </div>

          <div className="info-row">
            <span>Specialization</span>
            <span>{booking.specialization}</span>
          </div>

          <div className="info-row">
            <span>Hospital</span>
            <span>{booking.hospital_name}</span>
          </div>

          <div className="info-row">
            <span>Address</span>
            <span>{booking.hospital_address}</span>
          </div>
        </div>

        {/* Booking Info */}
        <div className="letter-section">
          <h3>Appointment Details</h3>

          <div className="info-row">
            <span>Date</span>
            <span>{formatDate(booking.appointment_date)}</span>
          </div>

          <div className="info-row">
            <span>Time Slot</span>
            <span>{booking.slot_time}</span>
          </div>

          <div className="info-row">
            <span>Consultation Fee</span>
            <span>₹ {booking.amount}</span>
          </div>

          <div className="info-row">
            <span>Verification Code</span>
            <span>{booking.verification_code}</span>
          </div>
        </div>

        {/* QR Section */}
        <div className="qr-section">
          {qrImage && <img src={qrImage} alt="QR Code" />}
          <p>Scan this QR at hospital reception for verification</p>
        </div>

        <button className="close-btn" onClick={close}>
          Close
        </button>

      </div>
    </div>
  );
}