import { useEffect, useState } from "react";
import TopNavbar from "./components/TopNavbar";
import SideNavbar from "./components/SideNavbar";
import Home from "./components/Home";

import CustomerHome from "./customer/CustomerHome";
import DoctorHome from "./doctor/DoctorHome";
import AdminHome from "./admin/AdminHome";

import Footer from "./components/Footer";
import AuthModal from "./components/AuthModal";
import "./App.css";

export default function App() {
  const [sideOpen, setSideOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);

  /* RESTORE SESSION */
  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => data && setUser(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div className={`app ${theme}`}>
      <TopNavbar
        onMenu={() => setSideOpen(true)}
        onLogin={() => setAuth({ type: "Login", role: "customer" })}
        onRegister={() => setAuth({ type: "Register", role: "customer" })}
        user={user}
      />

      {sideOpen && (
        <SideNavbar
          onClose={() => setSideOpen(false)}
          user={user}
          setTheme={setTheme}
          onDoctorLogin={() => setAuth({ type: "Login", role: "doctor" })}
          onDoctorRegister={() =>
            setAuth({ type: "Register", role: "doctor" })
          }
          onLogout={async () => {
            await fetch("http://localhost:3000/logout", {
              method: "POST",
              credentials: "include",
            });
            setUser(null);
            setSideOpen(false);
          }}
        />
      )}

      {/* 🔥 AUTH MODAL (FORCED REMOUNT) */}
      {auth && (
        <AuthModal
          key={auth.type + auth.role + Date.now()}
          type={auth.type}
          role={auth.role}
          onClose={() => setAuth(null)}
          onSuccess={(data) => {
            setUser(data);
            setAuth(null);
            setSideOpen(false);
          }}
        />
      )}

      {!user && <Home />}
      {user?.role === "customer" && <CustomerHome user={user} />}
      {user?.role === "doctor" && <DoctorHome user={user} />}
      {user?.role === "admin" && <AdminHome />}

      <Footer />
    </div>
  );
}
