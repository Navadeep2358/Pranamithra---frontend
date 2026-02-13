import "./DoctorHome.css";

export default function DoctorHome({ user }) {
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
        <div>
          <div className="welcome-text">WELCOME</div>
          <div className="doctor-name">Dr. {user.name}</div>
        </div>
      </div>

      {/* SERVICES */}
      <h3 className="services-heading">Services</h3>

      <div className="services-grid">
        <div className="service-box">My Appointments</div>
        <div className="service-box">Schedule the Day</div>
      </div>

      {/* ================= DOCTOR INSPIRATION SECTION ================= */}
      <div className="inspire-section">
        <h2 className="inspire-title">Caring Beyond Consultation</h2>

        <div className="inspire-grid">
          <div className="inspire-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
              alt="Doctor patient"
            />
            <p>"Every patient deserves empathy and time."</p>
          </div>

          <div className="inspire-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
              alt="Doctor consultation"
            />
            <p>"Listening carefully is the first step to healing."</p>
          </div>

          <div className="inspire-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2785/2785482.png"
              alt="Hospital care"
            />
            <p>"Your dedication transforms fear into hope."</p>
          </div>
        </div>
      </div>

      {/* ================= MEDICAL AWARENESS VIDEOS ================= */}
      <div className="video-section">
        <h2 className="section-title">Medical Awareness & Education</h2>

        {/* VIDEO 1 */}
        <div className="video-row">
          <iframe
            src="https://www.youtube.com/embed/S4wWClQhZaA"
            title="Video 1"
            allowFullScreen
          ></iframe>

          <div className="video-text">
            <h3>Understanding the Human Body</h3>
            <p>
              Continuous learning helps doctors provide better care.
              Staying informed improves diagnosis accuracy and
              patient confidence.
            </p>
          </div>
        </div>

        {/* VIDEO 2 */}
        <div className="video-row reverse">
          <iframe
            src="https://www.youtube.com/embed/5t6Yr4eZ9wY"
            title="Video 2"
            allowFullScreen
          ></iframe>

          <div className="video-text">
            <h3>Health Awareness for Better Living</h3>
            <p>
              Preventive healthcare reduces risks and improves
              long-term well-being. Awareness leads to healthier communities.
            </p>
          </div>
        </div>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="doctor-footer">
        <div className="footer-col">
          <h2>Pranamithra</h2>
          <p>"Healing is a matter of time, but also opportunity."</p>
          <p>"Where medicine is loved, humanity is served."</p>
        </div>

        <div className="footer-col">
          <h3>Quick Links</h3>
          <p>My Appointments</p>
          <p>Schedule the Day</p>
          <p>Profile</p>
          <p>Support</p>
        </div>

        <div className="footer-col">
          <h3>Feedback</h3>
          <p>For website updates or queries to admin.</p>

          <textarea
            className="feedback-input"
            placeholder="Write your feedback here..."
          />

          <button className="feedback-btn">Submit</button>
        </div>
      </div>

    </div>
  );
}