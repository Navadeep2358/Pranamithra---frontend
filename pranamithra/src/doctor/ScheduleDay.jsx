import { useState } from "react";
import "./ScheduleDay.css";

const API = "https://pranamithra-backend-aakk.onrender.com";

export default function ScheduleDay({ goBack, setActionLoading }) {

  const [scheduleDate, setScheduleDate] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [duration, setDuration] = useState(20);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);

  /* ✅ CUSTOM POPUP */
  const [popup, setPopup] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setFadeOut(false);

    setTimeout(() => setFadeOut(true), 2500);
    setTimeout(() => {
      setPopup(null);
      setFadeOut(false);
    }, 3000);
  };

  const GAP_MINUTES = 5;

  const getNextTwoDays = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const dayAfter = new Date(today);
    dayAfter.setDate(today.getDate() + 2);

    const format = (date) => date.toISOString().split("T")[0];
    return [format(tomorrow), format(dayAfter)];
  };

  const allowedDates = getNextTwoDays();

  const generateSlots = () => {

    if (!scheduleDate || !loginTime || !logoutTime) {
      showPopup("Please select date and times", "error");
      return;
    }

    const start = new Date(`1970-01-01T${loginTime}:00`);
    const end = new Date(`1970-01-01T${logoutTime}:00`);

    if (start >= end) {
      showPopup("Logout must be after login", "error");
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
    setSelectedSlots([]);
  };

  const toggleSlot = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter(s => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  const confirmSlots = async () => {
    setActionLoading(true);

    if (selectedSlots.length === 0) {
      showPopup("Select at least one slot", "error");
      return;
    }

    try {
      await fetch(`${API}/doctor/schedule`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          scheduleDate,
          loginTime,
          logoutTime,
          duration,
          selectedSlots
        }),
      });

      showPopup("Schedule Saved Successfully ✅", "success");
      setSlots([]);
      setSelectedSlots([]);

    } catch {
      showPopup("Something went wrong", "error");
    }

    setTimeout(() => {
  setActionLoading(false);
}, 3000);

  };

  return (
    <div className="schedule-container">

      {/* ✅ CUSTOM POPUP */}
      {popup && (
        <div className={`custom-popup ${popup.type} ${fadeOut ? "fade-out" : ""}`}>
          {popup.message}
        </div>
      )}

      <button className="back-global" onClick={goBack}>
        ← Back
      </button>

      <div className="schedule-left">

        <h2>Schedule Next 2 Days</h2>

        <div className="input-group">
          <label>Select Date</label>
          <select value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)}>
            <option value="">-- Select Date --</option>
            {allowedDates.map(date => (
              <option key={date} value={date}>
                {new Date(date).toDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label>Login Time</label>
          <input type="time" value={loginTime} onChange={(e) => setLoginTime(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Logout Time</label>
          <input type="time" value={logoutTime} onChange={(e) => setLogoutTime(e.target.value)} />
        </div>

        <div className="input-group">
          <label>Duration</label>
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            <option value={10}>10 Minutes</option>
            <option value={20}>20 Minutes</option>
            <option value={30}>30 Minutes</option>
          </select>
        </div>

        <button className="generate-btn" onClick={generateSlots}>
          Generate Slots
        </button>

      </div>

      <div className="schedule-right">

        {slots.length === 0 ? (
          <div className="placeholder-card">
            <h3>Enter date and times to get slots</h3>
          </div>
        ) : (
          <div className="slots-card">

            <h3>Select Slots</h3>

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

            <button className="confirm-btn" onClick={confirmSlots}>
              Confirm Slots
            </button>

          </div>
        )}

      </div>

    </div>
  );
}