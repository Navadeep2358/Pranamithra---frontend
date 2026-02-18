import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./MySchedules.css";

export default function MySchedules({ user, goBack }) {

  const [schedules, setSchedules] = useState([]);
  const [costDetails, setCostDetails] = useState(null);

  useEffect(() => {

    /* ================= FETCH ALL SCHEDULES ================= */
    const fetchSchedules = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/doctor/my-schedules",
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setSchedules(data);
        }

      } catch (err) {
        console.error(err);
      }
    };

    /* ================= FETCH COST ================= */
    const fetchCost = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/doctor/appointment-cost/${user.id}`,
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

    fetchSchedules();
    fetchCost();

  }, [user.id]);

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

      {schedules.length === 0 && <p>No schedules found.</p>}

      {schedules.map((schedule, i) => (
        <motion.div
          key={i}
          className="schedule-display-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* DATE */}
          <div className="schedule-date">
            <h2>
              {new Date(schedule.schedule_date).toDateString()}
            </h2>
          </div>

          {/* WORKING HOURS */}
          <div className="schedule-time">
            <h3>Working Hours</h3>
            <p>
              {schedule.login_time} - {schedule.logout_time}
            </p>
          </div>

          {/* COST */}
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

          {/* SLOTS */}
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
