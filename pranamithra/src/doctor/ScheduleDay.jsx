import { useState, useEffect } from "react";
import "./ScheduleDay.css";

export default function ScheduleDay({ user, goBack }) {

  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [duration, setDuration] = useState(30);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const GAP_MINUTES = 5; // 🔥 5 minute gap after every appointment

  /* ================= LOAD SAVED SCHEDULE ================= */
  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/doctor/schedule/${user.id}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();

          setLoginTime(data.login_time);
          setLogoutTime(data.logout_time);
          setDuration(data.duration);
          setSlots(data.available_slots || []);
          setSelectedSlots(data.available_slots || []);
          setEditMode(false);
        }
      } catch (err) {
        console.log("No previous schedule");
      }
    };

    fetchSchedule();
  }, [user.id]);

  /* ================= GENERATE SLOTS WITH 5 MIN GAP ================= */
  const generateSlots = () => {

    if (!loginTime || !logoutTime) {
      alert("Please select working hours");
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

      // Add appointment duration
      slotEnd.setMinutes(slotEnd.getMinutes() + duration);

      if (slotEnd > end) break;

      const formatted =
        slotStart.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) +
        " - " +
        slotEnd.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      temp.push(formatted);

      // 🔥 Move to next slot including 5 min gap
      current = new Date(slotEnd);
      current.setMinutes(current.getMinutes() + GAP_MINUTES);
    }

    setSlots(temp);
    setSelectedSlots([]);
  };

  /* ================= TOGGLE SLOT ================= */
  const toggleSlot = (slot) => {
    if (!editMode) return;

    setSelectedSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  /* ================= SAVE OR UPDATE ================= */
  const saveSchedule = async () => {

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
        setEditMode(false);
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

        <h1>{editMode ? "Edit Schedule" : "Doctor Schedule"}</h1>

        <div className="input-group">
          <label>Login Time</label>
          <input
            type="time"
            value={loginTime}
            disabled={!editMode}
            onChange={(e) => setLoginTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Logout Time</label>
          <input
            type="time"
            value={logoutTime}
            disabled={!editMode}
            onChange={(e) => setLogoutTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Duration</label>
          <select
            value={duration}
            disabled={!editMode}
            onChange={(e) => setDuration(Number(e.target.value))}
          >
            <option value={10}>10 Minutes</option>
            <option value={20}>20 Minutes</option>
            <option value={30}>30 Minutes</option>
          </select>
        </div>

        {editMode && (
          <button className="generate-btn" onClick={generateSlots}>
            Generate Slots
          </button>
        )}

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

        {!editMode ? (
          <button
            className="edit-btn"
            onClick={() => setEditMode(true)}
          >
            Update Slots
          </button>
        ) : (
          <button
            className="save-btn"
            onClick={saveSchedule}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}

      </div>
    </div>
  );
}
