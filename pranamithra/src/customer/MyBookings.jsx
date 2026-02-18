import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import AppointmentLetter from "./AppointmentLetter";
import "./MyBookings.css";

export default function MyBookings({ goBack }) {

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  /* ================= FETCH BOOKINGS ================= */
  useEffect(() => {
    fetch("http://localhost:3000/appointments/my", {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  /* ================= FETCH FULL DETAILS ================= */
  const fetchFullBooking = async (id) => {
    const res = await fetch(`http://localhost:3000/appointment/${id}`, {
      credentials: "include"
    });
    return await res.json();
  };

  /* ================= VIEW LETTER ================= */
  const viewLetter = async (bookingId) => {
    const fullData = await fetchFullBooking(bookingId);
    setSelectedBooking(fullData);
  };

  /* ================= DOWNLOAD LETTER ================= */
  const downloadLetter = async (bookingId) => {

    const booking = await fetchFullBooking(bookingId);

    const doc = new jsPDF();

    // Secure QR using backend token
    const qrImage = await QRCode.toDataURL(
      `http://localhost:3000/verify/${booking.qr_token}`
    );

    doc.setFontSize(18);
    doc.text("Pranamithra Hospital", 65, 20);

    doc.setFontSize(14);
    doc.text("Appointment Confirmation Letter", 50, 30);

    doc.setFontSize(12);

    // Patient Info
    doc.text("Patient Information:", 20, 45);
    doc.text(`Name: ${booking.customer_name}`, 20, 55);
    doc.text(`Email: ${booking.email}`, 20, 63);
    doc.text(`Phone: ${booking.phone}`, 20, 71);

    // Doctor Info
    doc.text("Doctor Information:", 20, 85);
    doc.text(`Doctor: ${booking.doctor_name}`, 20, 95);
    doc.text(`Specialization: ${booking.specialization}`, 20, 103);
    doc.text(`Hospital: ${booking.hospital_name}`, 20, 111);
    doc.text(`Address: ${booking.hospital_address}`, 20, 119);

    // Booking Info
    doc.text("Booking Details:", 20, 135);
    doc.text(`Date: ${booking.appointment_date}`, 20, 145);
    doc.text(`Slot: ${booking.slot_time}`, 20, 153);
    doc.text(`Consultation Fee: ₹ ${booking.amount}`, 20, 161);
    doc.text(`Verification Code: ${booking.verification_code}`, 20, 169);

    // QR
    doc.addImage(qrImage, "PNG", 140, 135, 50, 50);

    doc.setFontSize(10);
    doc.text("Scan QR at hospital reception for verification.", 20, 200);

    doc.save(`Appointment_${booking.id}.pdf`);
  };

  return (
    <div className="my-bookings-page">

      <h2 className="page-title">My Appointments</h2>

      {bookings.length === 0 && (
        <p className="no-bookings">No appointments booked yet.</p>
      )}

      <div className="booking-grid">
        {bookings.map((b) => (
          <div key={b.id} className="booking-card">

            <h3>{b.full_name}</h3>
            <p>{b.specialization}</p>

            <div className="booking-info">
              <p>📅 {b.appointment_date}</p>
              <p>⏰ {b.slot_time}</p>
              <p>💳 ₹ {b.amount}</p>
              <p className="status">Status: {b.status}</p>
            </div>

            <div className="btn-row">
              <button
                className="view-btn"
                onClick={() => viewLetter(b.id)}
              >
                View Appointment Letter
              </button>

              <button
                className="download-btn"
                onClick={() => downloadLetter(b.id)}
              >
                Download PDF
              </button>
            </div>

          </div>
        ))}
      </div>

      <button className="back-home-btn" onClick={goBack}>
        ← Back to Dashboard
      </button>

      {selectedBooking && (
        <AppointmentLetter
          booking={selectedBooking}
          close={() => setSelectedBooking(null)}
        />
      )}

    </div>
  );
}
