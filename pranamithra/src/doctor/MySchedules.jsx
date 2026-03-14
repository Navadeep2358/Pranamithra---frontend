import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./MySchedules.css";

/* ===== LOCALHOST BACKEND ===== */
const API = "https://pranamithra-backend-aakk.onrender.com";

export default function MySchedules({ user, goBack }) {

  const [schedules, setSchedules] = useState([]);
  const [costDetails, setCostDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if (!user || !user.id) return;

    const fetchSchedules = async () => {
      try {
        const res = await fetch(
          `${API}/doctor/my-schedules`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();

          const today = new Date().toISOString().split("T")[0];

          const filtered = data.filter(schedule => {
            return schedule.schedule_date >= today;
          });

          const formatted = filtered.map(schedule => ({
            ...schedule,
            available_slots:
              typeof schedule.available_slots === "string"
                ? JSON.parse(schedule.available_slots)
                : schedule.available_slots || []
          }));

          setSchedules(formatted);
        }

      } catch (err) {
        console.error(err);
      }
    };

    const fetchCost = async () => {
      try {
        const res = await fetch(
          `${API}/doctor/appointment-cost/${user.id}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setCostDetails(data);
        }

      } catch (err) {
        console.error(err);
      }
    };

    const loadData = async () => {
      setLoading(true);
      await fetchSchedules();
      await fetchCost();
      setLoading(false);
    };

    loadData();

  }, [user]);

  return (
    <motion.div
      className="myschedule-page"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >

      <motion.button
        className="back-btn"
        onClick={goBack}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        ← Back
      </motion.button>

      <h1 className="page-title">My Schedules</h1>

      {loading && <p>Loading schedules...</p>}

      {!loading && schedules.length === 0 && (
        <p>No schedules found.</p>
      )}

      {schedules.map((schedule, i) => (
        <motion.div
          key={schedule.id || i}
          className="schedule-display-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          <div className="schedule-date">
            <h2>
              {new Date(schedule.schedule_date).toDateString()}
            </h2>
          </div>

          <div className="schedule-time">
            <h3>Working Hours</h3>
            <p>
              {schedule.login_time} - {schedule.logout_time}
            </p>
          </div>

          {costDetails && (
            <div className="appointment-cost-display">
              <h3>Appointment Costs</h3>

              <div className="cost-grid">
                <div className="cost-box">
                  <span>10 Minutes</span>
                  <strong>₹ {costDetails.cost_10}</strong>
                </div>

                <div className="cost-box">
                  <span>20 Minutes</span>
                  <strong>₹ {costDetails.cost_20}</strong>
                </div>

                <div className="cost-box">
                  <span>30 Minutes</span>
                  <strong>₹ {costDetails.cost_30}</strong>
                </div>
              </div>
            </div>
          )}

          <div className="schedule-slots">
            <h3>Available Slots</h3>

            <div className="slots-grid">
              {schedule.available_slots.map((slot, index) => (
                <motion.div
                  key={index}
                  className="slot-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {slot}
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      ))}

    </motion.div>
  );
}