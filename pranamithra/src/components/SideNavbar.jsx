import './SideNavbar.css'

export default function SideNavbar({
  onClose,
  user,
  onDoctorLogin,
  onDoctorRegister,
  onLogout,
  setTheme
}) {
  return (
    <>
      {/* 🔥 OVERLAY ONLY WHEN SIDEBAR IS OPEN */}
      <div className="overlay" onClick={onClose}></div>

      <aside className="side-navbar">
        <div className="side-header">
          <h3>{user ? user.name : "Menu"}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {!user && (
          <div className="side-section">
            <button className="side-btn" onClick={onDoctorLogin}>
              Doctor Login
            </button>
            <button className="side-btn primary" onClick={onDoctorRegister}>
              Doctor Register
            </button>
          </div>
        )}

        {user && user.role === "customer" && (
          <div className="side-section">
            <button className="side-btn">Profile</button>
            <button className="side-btn">My Bookings</button>
            <button className="side-btn primary" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}

        {user && user.role === "doctor" && (
          <div className="side-section">
            <button className="side-btn">Profile</button>
            <button className="side-btn">My Appointments</button>
            <button className="side-btn primary" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}

        <div className="support">
          <strong>Theme</strong>
          <button className="side-btn" onClick={() => setTheme("light")}>Light</button>
          <button className="side-btn" onClick={() => setTheme("dark")}>Dark</button>
        </div>
      </aside>
    </>
  )
}
