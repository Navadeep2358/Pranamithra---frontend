import { useEffect, useState } from "react";
import TopNavbar from "./components/TopNavbar";
import SideNavbar from "./components/SideNavbar";
import Home from "./components/Home";
import CustomerHome from "./customer/CustomerHome";
import FindDoctor from "./customer/FindDoctor"; // ✅ ADDED
import DoctorHome from "./doctor/DoctorHome";
import ScheduleDay from "./doctor/ScheduleDay";
import MySchedules from "./doctor/MySchedules";
import AppointmentCost from "./doctor/AppointmentCost";
import AdminHome from "./admin/AdminHome";
import AuthModal from "./components/AuthModal";
import Profile from "./components/Profile";
import "./App.css";

export default function App() {

  const [sideOpen, setSideOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // ✅ Doctor Page Controller
  const [doctorPage, setDoctorPage] = useState("home");
  // home | schedule | myschedules | appointmentcost

  // ✅ Customer Page Controller (NEW)
  const [customerPage, setCustomerPage] = useState("home");
  // home | book

  const [toast, setToast] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const showToast = (message, type) => {
    setToast({ message, type });
    setFadeOut(false);

    setTimeout(() => setFadeOut(true), 4200);
    setTimeout(() => {
      setToast(null);
      setFadeOut(false);
    }, 5000);
  };

  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include"
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => data && setUser(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  return (
    <div className={`app ${theme}`}>

      {/* 🔥 GLOBAL TOAST */}
      {toast && (
        <div className={`global-toast ${toast.type} ${fadeOut ? "fade-out" : ""}`}>
          {toast.message}
        </div>
      )}

      {/* ================= TOP NAVBAR ================= */}
      <TopNavbar
        onMenu={() => setSideOpen(true)}
        onLogin={() => setAuth({ type: "Login", role: "customer" })}
        onRegister={() => setAuth({ type: "Register", role: "customer" })}
        user={user}
      />

      {/* ================= SIDE NAVBAR ================= */}
      {sideOpen && (
        <SideNavbar
          onClose={() => setSideOpen(false)}
          user={user}
          setTheme={setTheme}
          setShowProfile={setShowProfile}
          setShowMySchedules={() => setDoctorPage("myschedules")}
          setShowAppointmentCost={() => setDoctorPage("appointmentcost")}
          onDoctorLogin={() => setAuth({ type: "Login", role: "doctor" })}
          onDoctorRegister={() =>
            setAuth({ type: "Register", role: "doctor" })
          }
          onLogout={async () => {
            await fetch("http://localhost:3000/logout", {
              method: "POST",
              credentials: "include"
            });

            setUser(null);
            setSideOpen(false);
            setShowProfile(false);
            setDoctorPage("home");
            setCustomerPage("home"); // ✅ Reset customer page

            showToast("Logout Successful", "success");
          }}
        />
      )}

      {/* ================= AUTH MODAL ================= */}
      {auth && (
        <AuthModal
          key={auth.type + auth.role + Date.now()}
          type={auth.type}
          role={auth.role}
          onClose={() => setAuth(null)}
          onSuccess={data => {
            setUser(data);
            setAuth(null);
            setSideOpen(false);
            setDoctorPage("home");
            setCustomerPage("home"); // ✅ Reset customer page
          }}
        />
      )}

      {/* ================= MAIN RENDERING ================= */}

      {/* NOT LOGGED IN */}
      {!showProfile && !user && <Home />}

      {/* ================= CUSTOMER ================= */}

      {/* Customer Home */}
      {!showProfile && user?.role === "customer" && customerPage === "home" &&
        <CustomerHome
          user={user}
          openBookAppointment={() => setCustomerPage("book")}
        />
      }

      {/* Book Appointment Page */}
      {!showProfile && user?.role === "customer" && customerPage === "book" &&
        <FindDoctor
          goBack={() => setCustomerPage("home")}
        />
      }

      {/* ================= DOCTOR ================= */}

      {/* Doctor Dashboard */}
      {!showProfile && user?.role === "doctor" && doctorPage === "home" &&
        <DoctorHome
          user={user}
          openSchedule={() => setDoctorPage("schedule")}
        />
      }

      {/* Schedule Page */}
      {!showProfile && user?.role === "doctor" && doctorPage === "schedule" &&
        <ScheduleDay
          user={user}
          goBack={() => setDoctorPage("home")}
        />
      }

      {/* My Schedules Page */}
      {!showProfile && user?.role === "doctor" && doctorPage === "myschedules" &&
        <MySchedules
          user={user}
          goBack={() => setDoctorPage("home")}
        />
      }

      {/* Appointment Cost Page */}
      {!showProfile && user?.role === "doctor" && doctorPage === "appointmentcost" &&
        <AppointmentCost
          user={user}
          goBack={() => setDoctorPage("home")}
        />
      }

      {/* ================= ADMIN ================= */}
      {!showProfile && user?.role === "admin" &&
        <AdminHome />}

      {/* ================= PROFILE ================= */}
      {showProfile && (
        <Profile
          user={user}
          goBack={() => setShowProfile(false)}
        />
      )}

    </div>
  );
}
