import { useEffect, useState } from 'react'
import TopNavbar from './components/TopNavbar'
import SideNavbar from './components/SideNavbar'
import Home from './components/Home'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Success from './Success'
import './App.css'

export default function App() {
  const [sideOpen, setSideOpen] = useState(false)
  const [auth, setAuth] = useState(null)
  const [user, setUser] = useState(null)
  const [theme, setTheme] = useState('light')

  /* 🔥 RESTORE LOGIN ON REFRESH */
  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include"
    })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser(data)
      })
  }, [])

  return (
    <div className={`app ${theme}`}>
      <TopNavbar
        onMenu={() => setSideOpen(true)}
        onLogin={() => setAuth({ type: 'Login', role: 'Customer' })}
        onRegister={() => setAuth({ type: 'Register', role: 'Customer' })}
        user={user}
      />

      {/* 🔥 SIDE NAVBAR ONLY WHEN OPEN */}
      {sideOpen && (
        <SideNavbar
          onClose={() => setSideOpen(false)}
          user={user}
          setTheme={setTheme}
          onDoctorLogin={() => setAuth({ type: 'Login', role: 'Doctor' })}
          onDoctorRegister={() => setAuth({ type: 'Register', role: 'Doctor' })}
          onLogout={() => {
            fetch("http://localhost:3000/logout", { credentials: "include" })
            setUser(null)
            setSideOpen(false)   // 🔥 close overlay
          }}
        />
      )}

      {/* 🔥 AUTH MODAL */}
      {auth && (
        <AuthModal
          type={auth.type}
          role={auth.role}
          onClose={() => setAuth(null)}
          onSuccess={(data) => {
            setUser(data)
            setAuth(null)
            setSideOpen(false) // 🔥 remove dim
          }}
        />
      )}

      {/* 🔥 MAIN CONTENT */}
      {user ? <Success user={user} /> : <Home />}

      <Footer />
    </div>
  )
}
