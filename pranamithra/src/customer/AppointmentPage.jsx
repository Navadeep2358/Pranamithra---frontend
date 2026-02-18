import { useEffect, useState } from "react";
import "./AppointmentPage.css";

export default function AppointmentPage({ doctorId, goBack }) {

  const [doctor, setDoctor] = useState(null);
  const [costDetails, setCostDetails] = useState(null);

  const [step, setStep] = useState(1);
  const [agree, setAgree] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calculatedAmount, setCalculatedAmount] = useState(null);
  const [scheduleDuration, setScheduleDuration] = useState(null);

  const [loading, setLoading] = useState(true);

  /* ================= FETCH DOCTOR & COST ================= */
  useEffect(() => {
    if (!doctorId) return;

    const fetchData = async () => {
      try {
        const doctorRes = await fetch(
          `http://localhost:3000/customer/doctor/${doctorId}`,
          { credentials: "include" }
        );
        const doctorData = await doctorRes.json();
        setDoctor(doctorData);

        const costRes = await fetch(
          `http://localhost:3000/doctor/appointment-cost/${doctorId}`,
          { credentials: "include" }
        );
        const costData = await costRes.json();
        setCostDetails(costData);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  /* ================= DATE HELPERS ================= */
  /* ================= DATE HELPERS ================= */
const today = new Date();

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const dayAfter = new Date();
dayAfter.setDate(today.getDate() + 2);

const formatDate = (d) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const displayDate = (d) => d.toDateString();

  /* ================= FETCH SLOTS ================= */
  useEffect(() => {
    if (!selectedDate) return;

    fetch(
      `http://localhost:3000/doctor/available-slots?doctorId=${doctorId}&date=${selectedDate}`,
      { credentials: "include" }
    )
      .then(res => res.json())
      .then(data => {
        setSlots(data || []);
        setSelectedSlot(null);
        setCalculatedAmount(null);
        setScheduleDuration(null); // reset duration lock
      })
      .catch(err => console.error(err));

  }, [selectedDate, doctorId]);

  /* ================= GET SLOT DURATION ================= */
  const getDurationFromSlot = (slotString) => {
    const parts = slotString.split(" - ");
    if (parts.length !== 2) return 0;

    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":");

      hours = parseInt(hours);
      minutes = parseInt(minutes);

      if (modifier.toLowerCase() === "pm" && hours !== 12)
        hours += 12;

      if (modifier.toLowerCase() === "am" && hours === 12)
        hours = 0;

      return hours * 60 + minutes;
    };

    return parseTime(parts[1]) - parseTime(parts[0]);
  };

  /* ================= SLOT SELECT ================= */
  const handleSlotSelect = (slot) => {

    const duration = getDurationFromSlot(slot);

    // First slot selection sets duration lock
    if (!scheduleDuration) {
      setScheduleDuration(duration);
    }

    // Allow only same duration slots
    if (scheduleDuration && duration !== scheduleDuration) {
      return;
    }

    setSelectedSlot(slot);

    let amount = 0;
    if (duration === 10) amount = costDetails?.cost_10;
    if (duration === 20) amount = costDetails?.cost_20;
    if (duration === 30) amount = costDetails?.cost_30;

    setCalculatedAmount(amount);
  };

  /* ================= BOOK ================= */
  const handleBooking = async () => {

    if (!selectedSlot)
      return alert("Please select slot");

    const duration = getDurationFromSlot(selectedSlot);

    const res = await fetch("http://localhost:3000/book-appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        doctorId,
        slotTime: selectedSlot,
        duration,
        amount: calculatedAmount,
        date: selectedDate
      })
    });

    const msg = await res.text();

    if (!res.ok)
      return alert(msg);

    alert("Appointment Booked Successfully 🎉");
    goBack();
  };

  if (loading) return <p style={{ padding: 40 }}>Loading...</p>;
  if (!doctor) return <p style={{ padding: 40 }}>Doctor not found</p>;

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
        <div className="experience">{doctor.experience}+ Years Experience</div>

        <div className="hospital-box">
          <strong>Hospital:</strong> {doctor.hospital_name}<br />
          <strong>Address:</strong> {doctor.hospital_address}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="booking-panel">

        {/* STEPS */}
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
              <li>No refund policy.</li>
              <li>Carry valid ID proof.</li>
              <li>Emergency cases prioritized.</li>
              <li>Slot valid only for selected date.</li>
              <li>Doctor may reschedule in rare cases.</li>
              <li>Late arrival may reduce consultation time.</li>
              <li>Follow hospital safety protocols.</li>
              <li>Payments are non-transferable.</li>
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
              Proceed →
            </button>
          </>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <>
            <h3>Select Date</h3>

            <div className="date-grid">
              <div
                className={`date-card ${selectedDate === formatDate(tomorrow) ? "selected" : ""}`}
                onClick={() => setSelectedDate(formatDate(tomorrow))}
              >
                {displayDate(tomorrow)}
              </div>

              <div
                className={`date-card ${selectedDate === formatDate(dayAfter) ? "selected" : ""}`}
                onClick={() => setSelectedDate(formatDate(dayAfter))}
              >
                {displayDate(dayAfter)}
              </div>
            </div>

            {selectedDate && (
              <>
                <h3 style={{ marginTop: 30 }}>Available Slots</h3>

                <div className="slot-grid">

                  {slots.length === 0 && (
                    <div className="no-slots-box">
                      No slots available for this day.
                    </div>
                  )}

                  {slots.map((slot, index) => {
                    const duration = getDurationFromSlot(slot);
                    const disabled =
                      scheduleDuration && duration !== scheduleDuration;

                    return (
                      <div
                        key={index}
                        className={`slot-card ${selectedSlot === slot ? "selected" : ""} ${disabled ? "disabled" : ""}`}
                        onClick={() => !disabled && handleSlotSelect(slot)}
                      >
                        {slot}
                      </div>
                    );
                  })}

                </div>

                {calculatedAmount && (
                  <div className="amount-box">
                    Consultation Fee: ₹ {calculatedAmount}
                  </div>
                )}

                <button
                  className="confirm-btn"
                  disabled={!selectedSlot}
                  onClick={() => setStep(3)}
                >
                  Confirm Slot →
                </button>

                <button
                  className="small-back-btn"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
              </>
            )}
          </>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <>
            <h3 className="confirm-title">Confirm Appointment</h3>

            <div className="confirm-card">
              <p><strong>Doctor:</strong> {doctor.full_name}</p>
              <p><strong>Date:</strong> {selectedDate}</p>
              <p><strong>Slot:</strong> {selectedSlot}</p>
              <p><strong>Fee:</strong> ₹ {calculatedAmount}</p>
            </div>

            <div className="confirm-buttons">
              <button className="book-btn" onClick={handleBooking}>
                Book Appointment
              </button>

              <button
                className="back-btn-small"
                onClick={() => setStep(2)}
              >
                ← Back
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
