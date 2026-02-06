import "./TopNavbar.css";

export default function TopNavbar({ onMenu, onLogin, onRegister, user }) {
  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button className="menu-btn" onClick={onMenu}>☰</button>
        <span className="brand">Pranamithra</span>
      </div>

      <div className="nav-right">
        {!user && (
          <>
            <button onClick={onLogin}>Login</button>
            <button onClick={onRegister}>Register</button>
          </>
        )}

        {user && user.role === "doctor" && (
          <img
            src={`http://localhost:3000/uploads/${user.image}`}
            alt="Doctor"
            className="profile-pic"
            onClick={onMenu}
          />
        )}

        {user && user.role !== "doctor" && (
          <span className="welcome-text">
            Welcome, {user.name}
          </span>
        )}
      </div>
    </header>
  );
}
