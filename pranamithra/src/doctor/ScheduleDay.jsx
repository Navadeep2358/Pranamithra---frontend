import { useState } from "react";
import "./ScheduleDay.css";

export default function ScheduleDay({ user, goBack }) {

  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ================= GENERATE SLOTS ================= */
  const generateSlots = () => {
    if (!loginTime || !logoutTime) {
      alert("Please select login and logout time");
      return;
    }

    const start = new Date(`1970-01-01T${loginTime}:00`);
    const end = new Date(`1970-01-01T${logoutTime}:00`);

    if (start >= end) {
      alert("Logout time must be after login time");
      return;
    }

    let tempSlots = [];
    let current = new Date(start);

    while (current < end) {
      let slotStart = new Date(current);
      let slotEnd = new Date(current);
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      if (slotEnd <= end) {
        const formatted =
          slotStart.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }) +
          " - " +
          slotEnd.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });

        tempSlots.push(formatted);
      }

      current.setMinutes(current.getMinutes() + duration);
    }

    setSlots(tempSlots);
    setSelectedSlots([]);
  };

  /* ================= SELECT SLOT ================= */
  const toggleSlot = (slot) => {
    setSelectedSlots((prev) =>
      prev.includes(slot)
        ? prev.filter((s) => s !== slot)
        : [...prev, slot]
    );
  };

  /* ================= SAVE SCHEDULE ================= */
  const saveSchedule = async () => {
    if (!loginTime || !logoutTime) {
      alert("Please select working hours");
      return;
    }

    if (selectedSlots.length === 0) {
      alert("Please select at least one slot");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:8080/api/doctor/schedule",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            loginTime,
            logoutTime,
            duration,
            availableSlots: selectedSlots,
          }),
        }
      );

      const data = await res.text();

      if (!res.ok) {
        alert(data || "Failed to save schedule");
      } else {
        alert("Schedule saved successfully ✅");

        // Optional reset
        setSlots([]);
        setSelectedSlots([]);
      }

    } catch (err) {
      console.error(err);
      alert("Server error. Check backend.");
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

        <h1>Schedule Your Day</h1>

        <div className="input-group">
          <label>Login Time</label>
          <input
            type="time"
            value={loginTime}
            onChange={(e) => setLoginTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Logout Time</label>
          <input
            type="time"
            value={logoutTime}
            onChange={(e) => setLogoutTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Appointment Duration</label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>

        <button className="generate-btn" onClick={generateSlots}>
          Generate Slots
        </button>

        {slots.length > 0 && (
          <>
            <h3>Select Available Slots</h3>

            <div className="slots-grid">
              {slots.map((slot, index) => (
                <div
                  key={index}
                  className={`slot ${
                    selectedSlots.includes(slot) ? "active" : ""
                  }`}
                  onClick={() => toggleSlot(slot)}
                >
                  {slot}
                </div>
              ))}
            </div>

            <button
              className="save-btn"
              onClick={saveSchedule}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Schedule"}
            </button>
          </>
        )}

      </div>
    </div>
  );
}
