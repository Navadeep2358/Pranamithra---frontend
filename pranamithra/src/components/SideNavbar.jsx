import './SideNavbar.css'

export default function SideNavbar({
  onClose,
  user,
  onDoctorLogin,
  onDoctorRegister,
  onLogout,
  setTheme,
  setShowProfile,
  setShowMySchedules,
  setShowAppointmentCost,
  setShowMyBookings,
  setShowMyAppointments   // ✅ ADDED PROP
}) {
  return (
    <>
      <div className="overlay" onClick={onClose}></div>

      <aside className="side-navbar">
        <div className="side-header">
          <h3>{user ? user.name : "Menu"}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="side-content">

          {!user && (
            <>
              <div className="menu-card" onClick={onDoctorLogin}>
                <h4>Doctor Login</h4>
              </div>

              <div className="menu-card primary" onClick={onDoctorRegister}>
                <h4>Doctor Register</h4>
              </div>

              <div className="theme-card">
                <h4>Theme</h4>
                <div className="theme-actions">
                  <button onClick={() => setTheme("light")}>Light</button>
                  <button onClick={() => setTheme("dark")}>Dark</button>
                </div>
              </div>
            </>
          )}

          {/* ================= CUSTOMER ================= */}
          {user && user.role === "customer" && (
            <>
              <div
                className="menu-card"
                onClick={() => {
                  setShowProfile(true)
                  onClose()
                }}>
                <h4>Profile</h4>
              </div>

              <div
                className="menu-card"
                onClick={() => {
                  setShowMyBookings()
                  onClose()
                }}>
                <h4>My Bookings</h4>
              </div>

              <div className="bottom-card">
                <div className="menu-card danger" onClick={onLogout}>
                  <h4>Logout</h4>
                </div>
              </div>
            </>
          )}

          {/* ================= DOCTOR ================= */}
          {user && user.role === "doctor" && (
            <>
              <div
                className="menu-card"
                onClick={() => {
                  setShowProfile(true)
                  onClose()
                }}>
                <h4>Profile</h4>
              </div>

              <div
                className="menu-card"
                onClick={() => {
                  setShowMySchedules()
                  onClose()
                }}>
                <h4>My Schedules</h4>
              </div>

              <div
                className="menu-card"
                onClick={() => {
                  setShowAppointmentCost()
                  onClose()
                }}>
                <h4>Appointment Cost</h4>
              </div>

              {/* ✅ FIXED: My Appointments Connected */}
              <div
                className="menu-card"
                onClick={() => {
                  setShowMyAppointments()
                  onClose()
                }}>
                <h4>My Appointments</h4>
              </div>

              <div className="bottom-card">
                <div className="menu-card danger" onClick={onLogout}>
                  <h4>Logout</h4>
                </div>
              </div>
            </>
          )}

          {/* ================= ADMIN ================= */}
          {user && user.role === "admin" && (
            <>
              <div className="menu-card">
                <h4>My Admins List</h4>
              </div>

              <div className="theme-card">
                <h4>Theme</h4>
                <div className="theme-actions">
                  <button onClick={() => setTheme("light")}>Light</button>
                  <button onClick={() => setTheme("dark")}>Dark</button>
                </div>
              </div>

              <div className="bottom-card">
                <div className="menu-card danger" onClick={onLogout}>
                  <h4>Logout</h4>
                </div>
              </div>
            </>
          )}

        </div>
      </aside>
    </>
  )
}