import { useEffect, useState } from "react";
import axios from "axios";
import "./MyAppointments.css";

/* ===== LOCALHOST BACKEND ===== */
const API = "https://pranamithra-backend-aakk.onrender.com";

export default function MyAppointments({ goBack }) {

  const getNextThreeDays = () => {
    const today = new Date();
    return [0, 1, 2].map(i => {
      const d = new Date();
      d.setDate(today.getDate() + i);
      return d.toISOString().slice(0, 10);
    });
  };

  const allowedDates = getNextThreeDays();
  const [selectedDate, setSelectedDate] = useState(allowedDates[0]);

  const [booked, setBooked] = useState([]);
  const [available, setAvailable] = useState([]);
  const [remaining, setRemaining] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API}/doctor/dashboard?date=${selectedDate}`,
        { withCredentials: true }
      );

      setBooked(res.data.booked || []);
      setAvailable(res.data.available || []);
      setRemaining(res.data.remaining || 0);

    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
      setBooked([]);
      setAvailable([]);
      setRemaining(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [selectedDate]);

  const filteredBooked = booked.filter(app =>
    app.patient_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="appointments-container">

      {goBack && (
        <button className="back-btn" onClick={goBack}>
          ← Back
        </button>
      )}

      <h2>Doctor Dashboard</h2>

      {/* DATE TABS */}
      <div className="date-tabs">
        {allowedDates.map(date => (
          <div
            key={date}
            className={`date-tab ${selectedDate === date ? "active" : ""}`}
            onClick={() => setSelectedDate(date)}
          >
            {new Date(date).toDateString()}
          </div>
        ))}
      </div>

      {/* REMAINING */}
      <div className="remaining-box">
        Remaining Slots: {remaining}
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search patient..."
        className="search-box"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* AVAILABLE */}
      <div className="section">
        <h3>Available Slots</h3>

        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : available.length === 0 ? (
          <p className="empty-text">No available slots</p>
        ) : (
          <div className="slots-wrapper">
            {available.map((slot, i) => (
              <div key={i} className="slot-pill">
                {slot}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BOOKED */}
      <div className="section">
        <h3>Booked Appointments</h3><br />

        {loading ? (
          <p className="empty-text">Loading...</p>
        ) : filteredBooked.length === 0 ? (
          <p className="empty-text">No appointments</p>
        ) : (
          filteredBooked.map(app => (
            <div key={app.id} className="appointment-row">

              <div className="patient-name">
                {app.patient_name}
              </div>

              <button
                className="view-btn"
                onClick={() => setSelectedAppointment(app)}
              >
                View Details
              </button>

            </div>
          ))
        )}
      </div>

      {/* MODAL */}
      {selectedAppointment && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            className="premium-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Appointment Details</h3><br />

            <div className="modal-grid">
              <div>
                <span>Name : </span>
                <strong>{selectedAppointment.patient_name}</strong>
              </div>
              <div>
                <span>Email : </span>
                <strong>{selectedAppointment.patient_email}</strong>
              </div>
              <div>
                <span>Phone : </span>
                <strong>{selectedAppointment.patient_phone}</strong>
              </div>
              <div>
                <span>Date : </span>
                <strong>{selectedAppointment.appointment_date}</strong>
              </div>
              <div>
                <span>Slot : </span>
                <strong>{selectedAppointment.slot_time}</strong>
              </div>
            </div>

            <div className="verification-box">
              <p>Verification Code</p>
              <div className="code">
                {selectedAppointment.verification_code}
              </div>
            </div>

            <button
              className="close-btn"
              onClick={() => setSelectedAppointment(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}