import { useEffect, useState } from "react";
import "./AppointmentPage.css";

export default function AppointmentPage({ doctorId, goBack }) {

  const [doctor, setDoctor] = useState(null);
  const [step, setStep] = useState(1);

  const [agree, setAgree] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  /* ================= GET DOCTOR ================= */
  useEffect(() => {
    if (!doctorId) return;

    fetch(`http://localhost:3000/admin/doctors/${doctorId}`)
      .then(res => res.json())
      .then(data => setDoctor(data));
  }, [doctorId]);

  /* ================= REAL DATE CALCULATION ================= */
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const formatDate = (dateObj) =>
    dateObj.toISOString().split("T")[0];

  const displayDate = (dateObj) =>
    dateObj.toDateString();

  /* ================= FETCH SLOTS ================= */
  useEffect(() => {

    if (!selectedDate) return;

    fetch(
      `http://localhost:3000/doctor/available-slots?doctorId=${doctorId}&date=${selectedDate}`
    )
      .then(res => res.json())
      .then(data => {
        setSlots(data);
        setSelectedSlot(null);
      });

  }, [selectedDate, doctorId]);

  /* ================= BOOK APPOINTMENT ================= */
  const handleBooking = async () => {

    const res = await fetch("http://localhost:3000/book-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        doctorId,
        slotTime: selectedSlot.slot_time,
        duration: selectedSlot.duration,
        amount: selectedSlot.duration === 20 ? 400 : 300,
        date: selectedDate
      })
    });

    const msg = await res.text();

    if (res.ok) {
      alert("Appointment Booked Successfully 🎉");
      goBack();
    } else {
      alert(msg);
    }
  };

  if (!doctor) return <p style={{ padding: 40 }}>Loading...</p>;

  return (
    <div className="appointment-main">

      {/* LEFT PANEL */}
      <div className="doctor-panel">

        <img
          src={`http://localhost:3000/uploads/${doctor.doctor_image}`}
          className="doctor-image"
          alt="Doctor"
        />

        <div className="doctor-name">{doctor.full_name}</div>
        <div className="spec">{doctor.specialization}</div>
        <div className="experience">
          {doctor.experience}+ Years Experience
        </div>

        <div className="hospital-box">
          <strong>Hospital:</strong> {doctor.hospital_name}<br />
          <strong>Address:</strong> {doctor.hospital_address}
        </div>

      </div>

      {/* RIGHT PANEL */}
      <div className="booking-panel">

        <div className="steps">
          <div className={`step ${step === 1 ? "active" : ""}`}>1. Terms</div>
          <div className={`step ${step === 2 ? "active" : ""}`}>2. Select Slot</div>
          <div className={`step ${step === 3 ? "active" : ""}`}>3. Confirm</div>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <>
            <h3>Terms & Conditions</h3>
            <ul className="terms-list">
              <li>Appointment once booked cannot be cancelled.</li>
              <li>Please arrive 15 minutes early.</li>
              <li>Carry valid ID proof.</li>
              <li>Late arrival may reschedule.</li>
              <li>Payment at hospital only.</li>
              <li>Doctor availability may vary.</li>
              <li>No refund policy.</li>
              <li>Follow hospital guidelines.</li>
              <li>Emergency cases prioritized.</li>
              <li>Slot valid only for selected date.</li>
            </ul>

            <div className="checkbox-row">
              <input
                type="checkbox"
                checked={agree}
                onChange={() => setAgree(!agree)}
              />
              <label>I agree to all terms</label>
            </div>

            <button
              className="primary-btn"
              disabled={!agree}
              onClick={() => setStep(2)}
            >
              Proceed to Booking →
            </button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h3>Select Date</h3>

            <div className="date-grid">
              <div
                className={`date-card ${
                  selectedDate === formatDate(tomorrow) ? "selected" : ""
                }`}
                onClick={() => setSelectedDate(formatDate(tomorrow))}
              >
                {displayDate(tomorrow)}
              </div>

              <div
                className={`date-card ${
                  selectedDate === formatDate(dayAfter) ? "selected" : ""
                }`}
                onClick={() => setSelectedDate(formatDate(dayAfter))}
              >
                {displayDate(dayAfter)}
              </div>
            </div>

            {selectedDate && (
              <>
                <h3 style={{ marginTop: 30 }}>Available Slots</h3>

                <div className="slot-grid">
                  {slots.length === 0 && <p>No slots available</p>}

                  {slots.map((slot, index) => (
                    <div
                      key={index}
                      className={`slot-card ${
                        selectedSlot?.slot_time === slot.slot_time
                          ? "selected"
                          : ""
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot.slot_time}
                    </div>
                  ))}
                </div>

                <button
                  className="primary-btn"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                >
                  Confirm Slot →
                </button>
              </>
            )}
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h3>Confirm Appointment</h3>

            <div className="summary">
              Doctor: {doctor.full_name} <br />
              Date: {selectedDate} <br />
              Slot: {selectedSlot?.slot_time}
            </div>

            <button
              className="primary-btn"
              onClick={handleBooking}
            >
              Book Appointment
            </button>

            <button
              className="secondary-btn"
              onClick={() => setStep(2)}
            >
              ← Back
            </button>
          </>
        )}

      </div>
    </div>
  );
}
