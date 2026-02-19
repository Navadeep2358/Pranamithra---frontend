import { useEffect, useState } from "react";
import TopNavbar from "./components/TopNavbar";
import SideNavbar from "./components/SideNavbar";
import Home from "./components/Home";

import CustomerHome from "./customer/CustomerHome";
import FindDoctor from "./customer/FindDoctor";
import AppointmentPage from "./customer/AppointmentPage";
import MyBookings from "./customer/MyBookings";

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

  // PAGE CONTROLLERS
  const [doctorPage, setDoctorPage] = useState("home");
  const [customerPage, setCustomerPage] = useState("home");
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  // SESSION CHECK
  useEffect(() => {
    fetch("http://localhost:3000/me", {
      credentials: "include"
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading...</div>;
  }

  return (
    <div className={`app ${theme}`}>

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
          setShowMyBookings={() => setCustomerPage("mybookings")}
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
            setCustomerPage("home");
            setSelectedDoctorId(null);
          }}
        />
      )}

      {/* ================= AUTH MODAL ================= */}
      {auth && (
        <AuthModal
          type={auth.type}
          role={auth.role}
          onClose={() => setAuth(null)}
          onSuccess={(data) => {
            setUser(data);
            setAuth(null);
            setSideOpen(false);
            setDoctorPage("home");
            setCustomerPage("home");
            setSelectedDoctorId(null);
          }}
        />
      )}

      {/* ================= MAIN CONTENT ================= */}

      {/* NOT LOGGED IN */}
      {!showProfile && !user && <Home />}

      {/* ================= CUSTOMER ================= */}
      {user?.role === "customer" && !showProfile && (
        <>
          {customerPage === "home" && (
            <CustomerHome
              user={user}
              openBookAppointment={() => setCustomerPage("book")}
              openMyBookings={() => setCustomerPage("mybookings")}
            />
          )}

          {customerPage === "book" && (
            <FindDoctor
              goBack={() => setCustomerPage("home")}
              openAppointment={(doctorId) => {
                setSelectedDoctorId(doctorId);
                setCustomerPage("appointment");
              }}
            />
          )}

          {customerPage === "appointment" && (
            <AppointmentPage
              doctorId={selectedDoctorId}
              goBack={() => setCustomerPage("book")}
            />
          )}

          {customerPage === "mybookings" && (
            <MyBookings
              goBack={() => setCustomerPage("home")}
            />
          )}
        </>
      )}

      {/* ================= DOCTOR ================= */}
      {user?.role === "doctor" && !showProfile && (
        <>
          {doctorPage === "home" && (
            <DoctorHome
              user={user}
              openSchedule={() => setDoctorPage("schedule")}
            />
          )}

          {doctorPage === "schedule" && (
            <ScheduleDay
              user={user}
              goBack={() => setDoctorPage("home")}
            />
          )}

          {doctorPage === "myschedules" && (
            <MySchedules
              user={user}
              goBack={() => setDoctorPage("home")}
            />
          )}

          {doctorPage === "appointmentcost" && (
            <AppointmentCost
              user={user}
              goBack={() => setDoctorPage("home")}
            />
          )}
        </>
      )}

      {/* ================= ADMIN ================= */}
      {user?.role === "admin" && !showProfile && <AdminHome />}

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