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
      {/* Overlay */}
      <div className="overlay" onClick={onClose}></div>

      <aside className="side-navbar">
        {/* Header */}
        <div className="side-header">
          <h3>{user ? user.name : "Menu"}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* CONTENT */}
        <div className="side-content">

          {/* GUEST */}
          {!user && (
            <>
              <div className="menu-card" onClick={onDoctorLogin}>
                <h4>Doctor Login</h4>
              </div>

              <div className="menu-card primary" onClick={onDoctorRegister}>
                <h4>Doctor Register</h4>
              </div>

              {/* THEME */}
              <div className="theme-card">
                <h4>Theme</h4>
                <div className="theme-actions">
                  <button onClick={() => setTheme("light")}>Light</button>
                  <button onClick={() => setTheme("dark")}>Dark</button>
                </div>
              </div>
            </>
          )}

          {/* CUSTOMER */}
          {user && user.role === "customer" && (
            <>
              <div className="menu-card">
                <h4>Profile</h4>
              </div>

              <div className="menu-card">
                <h4>My Bookings</h4>
              </div>

              <div className="bottom-card">
                <div className="menu-card danger" onClick={onLogout}>
                  <h4>Logout</h4>
                </div>
              </div>
            </>
          )}

          {/* DOCTOR */}
          {user && user.role === "doctor" && (
            <>
              <div className="menu-card">
                <h4>Profile</h4>
              </div>

              <div className="menu-card">
                <h4>My Appointments</h4>
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