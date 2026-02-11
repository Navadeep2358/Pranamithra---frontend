import "./DoctorHome.css";

export default function DoctorHome({ user }) {
  // SAFETY CHECK
  if (!user || user.role !== "doctor") return null;

  /* ================= PENDING ================= */
  if (user.status === "PENDING") {
    return (
      <div className="doctor-status-container">
        <h1>Your account is under verification.</h1>
        <p>This process may take 24–48 hours.</p>
        <p>Thank you for your patience.</p>
      </div>
    );
  }

  /* ================= REJECTED ================= */
  if (user.status === "REJECTED") {
    return (
      <div className="doctor-status-container rejected">
        <h1>Your account has been rejected.</h1>
        <p>
          Please contact customer support<br />
          or chat with us through the Pranamithra bot.
        </p>
      </div>
    );
  }

  /* ================= VERIFIED ================= */
  return (
    <div className="doctor-container">
      {/* HERO */}
      <div className="doctor-hero">
        <div className="welcome-text">WELCOME</div>
        <div className="doctor-text">Dr. {user.name}</div>
      </div>

      {/* FUTURE SECTIONS */}
      <div className="doctor-content">
        <p>Doctor dashboard features will appear here.</p>
      </div>
    </div>
  );
}
