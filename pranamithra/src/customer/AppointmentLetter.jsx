import { QRCodeCanvas } from "qrcode.react";
import "./AppointmentLetter.css";

export default function AppointmentLetter({ booking, close }) {

  const qrUrl = `http://localhost:3000/verify/${booking.qr_token}`;

  return (
    <div className="letter-overlay">

      <div className="appointment-letter">

        <h2>Appointment Confirmation</h2>

        <div className="letter-section">
          <h4>Patient Information</h4>
          <p>Name: {booking.customer_name}</p>
          <p>Email: {booking.email}</p>
          <p>Phone: {booking.phone}</p>
        </div>

        <div className="letter-section">
          <h4>Doctor Information</h4>
          <p>Doctor: {booking.doctor_name}</p>
          <p>Specialization: {booking.specialization}</p>
          <p>Hospital: {booking.hospital_name}</p>
          <p>Address: {booking.hospital_address}</p>
        </div>

        <div className="letter-section">
          <h4>Booking Details</h4>
          <p>Date: {booking.appointment_date}</p>
          <p>Slot: {booking.slot_time}</p>
          <p>Fee: ₹ {booking.amount}</p>
          <p>Verification Code: {booking.verification_code}</p>
        </div>

        <div className="qr-section">
          <QRCodeCanvas value={qrUrl} size={160} />
          <p>Scan at hospital reception</p>
        </div>

        <button className="close-btn" onClick={close}>
          Close
        </button>

      </div>
    </div>
  );
}
