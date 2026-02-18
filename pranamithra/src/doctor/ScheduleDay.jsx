import { useState, useEffect } from "react";
import "./ScheduleDay.css";

export default function ScheduleDay({ user, goBack }) {

  const [scheduleDate, setScheduleDate] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [duration, setDuration] = useState(20);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  const GAP_MINUTES = 5;

  /* ================= NEXT 2 DAYS ================= */
  const getNextTwoDays = () => {
    const today = new Date();

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const format = (date) =>
      date.toISOString().split("T")[0];

    return [format(tomorrow), format(dayAfter)];
  };

  const allowedDates = getNextTwoDays();

  /* ================= GENERATE SLOTS ================= */
  const generateSlots = () => {

    if (!scheduleDate || !loginTime || !logoutTime) {
      alert("Please select date and working hours");
      return;
    }

    const start = new Date(`1970-01-01T${loginTime}:00`);
    const end = new Date(`1970-01-01T${logoutTime}:00`);

    if (start >= end) {
      alert("Logout must be after login");
      return;
    }

    let temp = [];
    let current = new Date(start);

    while (current < end) {

      let slotStart = new Date(current);
      let slotEnd = new Date(current);

      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      if (slotEnd > end) break;

      const formatted =
        slotStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " - " +
        slotEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      temp.push(formatted);

      current = new Date(slotEnd);
      current.setMinutes(current.getMinutes() + GAP_MINUTES);
    }

    setSlots(temp);
    setSelectedSlots([]); // reset selection
  };

  /* ================= SLOT TOGGLE FIXED ================= */
  const toggleSlot = (slot) => {

    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  /* ================= SAVE ================= */
  const saveSchedule = async () => {

    if (!scheduleDate) {
      alert("Select schedule date");
      return;
    }

    if (selectedSlots.length === 0) {
      alert("Select at least one slot");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:3000/doctor/schedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            scheduleDate,
            loginTime,
            logoutTime,
            duration,
            availableSlots: selectedSlots
          }),
        }
      );

      const text = await res.text();

      if (!res.ok) {
        alert(text);
      } else {
        alert("Schedule saved successfully ✅");
      }

    } catch (err) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="schedule-page">
      <div className="schedule-card">

        {goBack && (
          <button className="back-btn" onClick={goBack}>
            ← Back
          </button>
        )}

        <h1>Schedule Next 2 Days</h1>

        {/* DATE */}
        <div className="input-group">
          <label>Select Date</label>
          <select
            value={scheduleDate}
            onChange={(e) => setScheduleDate(e.target.value)}
          >
            <option value="">-- Select Date --</option>
            {allowedDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toDateString()}
              </option>
            ))}
          </select>
        </div>

        {/* LOGIN */}
        <div className="input-group">
          <label>Login Time</label>
          <input
            type="time"
            value={loginTime}
            onChange={(e) => setLoginTime(e.target.value)}
          />
        </div>

        {/* LOGOUT */}
        <div className="input-group">
          <label>Logout Time</label>
          <input
            type="time"
            value={logoutTime}
            onChange={(e) => setLogoutTime(e.target.value)}
          />
        </div>

        {/* DURATION */}
        <div className="input-group">
          <label>Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={10}>10 Minutes</option>
            <option value={20}>20 Minutes</option>
            <option value={30}>30 Minutes</option>
          </select>
        </div>

        <button className="generate-btn" onClick={generateSlots}>
          Generate Slots
        </button>

        {slots.length > 0 && (
          <>
            <h3>Available Slots</h3>

            <div className="slots-grid">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`slot ${selectedSlots.includes(slot) ? "active" : ""}`}
                  onClick={() => toggleSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>
          </>
        )}

        <button
          className="save-btn"
          onClick={saveSchedule}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Schedule"}
        </button>

      </div>
    </div>
  );
}
