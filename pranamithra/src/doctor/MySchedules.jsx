import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./MySchedules.css";

export default function MySchedules({ user, goBack }) {

  const [schedule, setSchedule] = useState(null);
  const [costDetails, setCostDetails] = useState(null);

  useEffect(() => {

    // Fetch Schedule
    const fetchSchedule = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/doctor/schedule/${user.id}`,
          { credentials: "include" }
        );

        if (res.ok) {
          const data = await res.json();
          setSchedule(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    // Fetch Appointment Cost
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

    fetchSchedule();
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

      <h1 className="page-title">My Latest Schedule</h1>

      {!schedule && <p>No schedule found.</p>}

      {schedule && (
        <motion.div
          className="schedule-display-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >

          {/* Working Hours */}
          <div className="schedule-time">
            <h3>Working Hours</h3>
            <p>
              {schedule.login_time} - {schedule.logout_time}
            </p>
          </div>

          {/* Appointment Cost Section */}
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

          {/* Available Slots */}
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
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {slot}
                </motion.div>
              ))}
            </div>

          </div>

        </motion.div>
      )}

    </motion.div>
  );
}
