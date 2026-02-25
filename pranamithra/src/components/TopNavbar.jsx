import "./TopNavbar.css";

/* ===== LOCALHOST BACKEND ===== */
const API = "http://localhost:3000";

export default function TopNavbar({ onMenu, onLogin, onRegister, user }) {
  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={onMenu}>☰</button>
        <span className="brand">Pranamithra</span>
      </div>

      <div className="nav-right">
        {/* NOT LOGGED IN */}
        {!user && (
          <>
            <button onClick={onLogin}>Login</button>
            <button onClick={onRegister}>Register</button>
          </>
        )}

        {/* DOCTOR */}
        {user && user.role === "doctor" && (
          <img
            src={`${API}/uploads/${user.image}`}
            alt="Doctor"
            className="profile-pic"
            onClick={onMenu}
          />
        )}

        {/* CUSTOMER & ADMIN */}
        {user && user.role !== "doctor" && (
          <div
            className="profile-emoji"
            onClick={onMenu}
            title={user.name}
          >
            👤
          </div>
        )}
      </div>
    </header>
  );
}