import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import AppointmentLetter from "./AppointmentLetter";
import "./MyBookings.css";

/* ===== LOCALHOST BACKEND ===== */
const API = "http://localhost:3000";

export default function MyBookings({ goBack }) {

  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);

  /* ================= FETCH BOOKINGS ================= */
  useEffect(() => {
    fetch(`${API}/appointments/my`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => setBookings(data))
      .catch(err => console.error(err));
  }, []);

  /* ================= FETCH FULL DETAILS ================= */
  const fetchFullBooking = async (id) => {
    const res = await fetch(`${API}/appointment/${id}`, {
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

    try {

      const booking = await fetchFullBooking(bookingId);
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setDrawColor(200);
      doc.rect(10, 10, pageWidth - 20, 277);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("Pranamithra Hospital", pageWidth / 2, 25, { align: "center" });

      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text("Appointment Confirmation Letter", pageWidth / 2, 33, { align: "center" });

      doc.line(20, 38, pageWidth - 20, 38);

      let y = 50;

      const sectionTitle = (title) => {
        doc.setFillColor(240, 242, 255);
        doc.rect(20, y - 6, pageWidth - 40, 8, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(title, 25, y);
        y += 12;
      };

      const row = (label, value) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(label, 25, y);
        doc.text(String(value || "-"), 110, y);
        y += 8;
      };

      /* ===== Patient Info ===== */
      sectionTitle("Patient Information");
      row("Name:", booking.customer_name);
      row("Email:", booking.email);
      row("Phone:", booking.phone);

      y += 5;

      /* ===== Doctor Info ===== */
      sectionTitle("Doctor Information");
      row("Doctor:", booking.doctor_name);
      row("Specialization:", booking.specialization);
      row("Hospital:", booking.hospital_name);
      row("Address:", booking.hospital_address);

      y += 5;

      /* ===== Appointment Details ===== */
      sectionTitle("Appointment Details");
      row(
        "Date:",
        new Date(booking.appointment_date).toLocaleDateString("en-IN")
      );
      row("Slot:", booking.slot_time);
      row("Consultation Fee:", `₹ ${booking.amount}`);
      row("Verification Code:", booking.verification_code);

      /* ===== QR Code ===== */
      if (booking.qr_token) {

        const qrImage = await QRCode.toDataURL(
          `${API}/verify/${booking.qr_token}`
        );

        doc.addImage(qrImage, "PNG", pageWidth / 2 - 25, y + 10, 50, 50);

        doc.setFontSize(10);
        doc.text(
          "Scan this QR at hospital reception for verification.",
          pageWidth / 2,
          y + 70,
          { align: "center" }
        );
      }

      /* ===== Footer ===== */
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(
        "This is a system-generated appointment confirmation.",
        pageWidth / 2,
        285,
        { align: "center" }
      );

      doc.save(`Appointment_${booking.id}.pdf`);

    } catch (error) {
      console.error("Download failed:", error);
      alert("Error generating PDF. Check console.");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
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

            <div className="card-header">
              <h3 className="doctor-name">{b.doctor_name}</h3>
              <p className="doctor-specialization">{b.specialization}</p>
            </div>

            <div className="booking-info">

              <div className="info-row">
                <span>📅 Date</span>
                <span>{formatDate(b.appointment_date)}</span>
              </div>

              <div className="info-row">
                <span>⏰ Time</span>
                <span>{b.slot_time}</span>
              </div>

              <div className="info-row">
                <span>💳 Fee</span>
                <span>₹ {b.amount}</span>
              </div>

              <div className="info-row">
                <span>Status</span>
                <span className="status">{b.status}</span>
              </div>

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