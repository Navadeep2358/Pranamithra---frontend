import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import "./AppointmentCost.css"

export default function AppointmentCost({ user, goBack }) {

  const [cost10, setCost10] = useState("")
  const [cost20, setCost20] = useState("")
  const [cost30, setCost30] = useState("")
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetch(`http://localhost:3000/doctor/appointment-cost/${user.id}`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(data => {
        if (data) {
          setCost10(data.cost_10 || "")
          setCost20(data.cost_20 || "")
          setCost30(data.cost_30 || "")
        }
      })
  }, [user.id])

  const handleSave = async () => {
  try {
    const res = await fetch(
      "http://localhost:3000/doctor/appointment-cost",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",   // 🔥 VERY IMPORTANT
        body: JSON.stringify({
          cost10,
          cost20,
          cost30,
        }),
      }
    );

    const text = await res.text();
    setMessage(text);
  } catch (err) {
    console.error(err);
  }
};


  return (
    <motion.div
      className="appointment-cost-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >

      <button className="back-btn" onClick={goBack}>← Back</button>

      <h1>Appointment Cost Setup</h1>

      <div className="cost-card">

        <label>10 Minutes Appointment Cost (₹)</label>
        <input
          type="number"
          value={cost10}
          onChange={(e) => setCost10(e.target.value)}
        />

        <label>20 Minutes Appointment Cost (₹)</label>
        <input
          type="number"
          value={cost20}
          onChange={(e) => setCost20(e.target.value)}
        />

        <label>30 Minutes Appointment Cost (₹)</label>
        <input
          type="number"
          value={cost30}
          onChange={(e) => setCost30(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Costs
        </button>

        {message && <p className="success-msg">{message}</p>}

      </div>

      <div className="note-box">
        <strong>Note:</strong> Patients must pay the appointment
        fee offline at the hospital only.
      </div>

    </motion.div>
  )
}
