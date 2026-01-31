import './TopNavbar.css'

export default function TopNavbar({ onMenu, onLogin, onRegister, user }) {
  return (
    <header className="top-navbar">
      <div className="nav-left">
        <button onClick={onMenu}>☰</button>
        <span>Pranamithra</span>
      </div>

      <div className="nav-right">
        {!user && (
          <>
            <button onClick={onLogin}>Login</button>
            <button onClick={onRegister}>Register</button>
          </>
        )}

        {user && (
          <span style={{ fontWeight: 600 }}>
            Welcome, {user.name}
          </span>
        )}
      </div>
    </header>
  )
}
