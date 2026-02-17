import "./CustomerHome.css";

export default function CustomerHome({ user, goToDoctors }) {
  return (
    <div className="customer-home">
      

      {/* ================= HERO SECTION ================= */}
      <div className="hero-section">
        <h2 className="hero-subtitle">WELCOME</h2>
        <h1 className="hero-title">
          {user?.name || "Customer"}
        </h1>
      </div>

      {/* ================= MAIN DASHBOARD CARDS ================= */}
      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Book Appointment</h3>
          <p>Schedule appointments with doctors easily.</p>
          <button onClick={goToDoctors}>
            Book Now
          </button>
        </div>

        <div className="dashboard-card">
          <h3>My Bookings</h3>
          <p>View your booked appointments.</p>
          <button>View</button>
        </div>

      </div>

      {/* ================= FEATURE SECTION ================= */}
      <div className="feature-section">
        <h2>Your Health, Our Priority</h2>

        <div className="feature-container">

          <div className="feature-card">
            <h4>Expert Doctors</h4>
            <p>
              Consult experienced and trusted healthcare professionals.
            </p>
          </div>

          <div className="feature-card">
            <h4>Easy Scheduling</h4>
            <p>
              Quick and simple appointment booking system.
            </p>
          </div>

          <div className="feature-card">
            <h4>Secure Data</h4>
            <p>
              Your medical records are safe and confidential.
            </p>
          </div>

        </div>
      </div>

      {/* ================= MEDICAL VIDEO SECTION ================= */}
      <div className="video-section">
        <h2>Medical Awareness & Education</h2>

        <div className="video-row">
          <div className="video-card">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/ruM4Xxhx32U"
              title="How Heart Works"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-text">
            <h3>Understanding How the Heart Works</h3>
            <p>
              The human heart pumps oxygen-rich blood throughout the body.
              Maintaining heart health through exercise, a balanced diet,
              and regular checkups helps prevent cardiovascular diseases.
            </p>
          </div>
        </div>

        <div className="video-row reverse">
          <div className="video-card">
            <iframe
              width="100%"
              height="250"
              src="https://www.youtube.com/embed/bHZsvBdUC2I"
              title="How Lungs Work"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>

          <div className="video-text">
            <h3>How the Lungs Support Breathing</h3>
            <p>
              The lungs exchange oxygen and carbon dioxide between air
              and blood. Avoid smoking and maintain physical fitness
              to support respiratory health.
            </p>
          </div>
        </div>
      </div>

      {/* ================= INSPIRATION SECTION ================= */}
      <div className="inspiration-section">
        <h2 className="inspiration-heading">
          Caring Beyond Consultation
        </h2>

        <div className="inspiration-container">

          <div className="inspiration-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
              alt="Doctor 1"
            />
            <p>"Every patient deserves empathy and time."</p>
          </div>

          <div className="inspiration-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774300.png"
              alt="Doctor 2"
            />
            <p>"Listening carefully is the first step to healing."</p>
          </div>

          <div className="inspiration-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3774/3774293.png"
              alt="Doctor 3"
            />
            <p>"Your dedication transforms fear into hope."</p>
          </div>

        </div>
      </div>

      {/* ================= TOP DOCTORS ADVERTISEMENT ================= */}
      <div className="top-doctors-section">

        <h2 className="top-doctors-heading">
          Book Appointment with World No.1 Doctors
        </h2>

        <div className="doctor-scroll-container">
      <div className="doctor-scroll">

  {/* Doctor Card 1 */}
  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" alt="Doctor" />
    <h4>Dr. Arjun Sharma</h4>
    <p>Apollo Hospital</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" alt="Doctor" />
    <h4>Dr. Meera Reddy</h4>
    <p>Fortis Healthcare</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80" alt="Doctor" />
    <h4>Dr. Vikram Patel</h4>
    <p>Max Hospital</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80" alt="Doctor" />
    <h4>Dr. Neha Kapoor</h4>
    <p>AIIMS Delhi</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" alt="Doctor" />
    <h4>Dr. Rohit Verma</h4>
    <p>Manipal Hospital</p>
  </div>

  {/* Duplicate for infinite scroll */}

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&q=80" alt="Doctor" />
    <h4>Dr. Arjun Sharma</h4>
    <p>Apollo Hospital</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80" alt="Doctor" />
    <h4>Dr. Meera Reddy</h4>
    <p>Fortis Healthcare</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&q=80" alt="Doctor" />
    <h4>Dr. Vikram Patel</h4>
    <p>Max Hospital</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=400&q=80" alt="Doctor" />
    <h4>Dr. Neha Kapoor</h4>
    <p>AIIMS Delhi</p>
  </div>

  <div className="doctor-card">
    <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80" alt="Doctor" />
    <h4>Dr. Rohit Verma</h4>
    <p>Manipal Hospital</p>
  </div>

</div>


        </div>

      </div>

      {/* ================= FOOTER ================= */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h2 className="footer-logo">Pranamithra</h2>
            <p>
              A complete hospital appointment management system.
              Book doctors, manage records, and experience seamless healthcare.
            </p>
          </div>

          <div className="footer-column">
            <h3>Quick Links</h3>
            <ul>
              <li>Home</li>
              <li>Doctors</li>
              <li>Appointments</li>
              <li>Contact</li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Feedback</h3>
            <p>We value your feedback to improve our services.</p>

            <div className="feedback-box-footer">
              <textarea
                placeholder="Write your feedback..."
                rows="3"
              ></textarea>
              <button>Submit</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 Pranamithra | All Rights Reserved
        </div>
      </footer>

    </div>
  );
}


