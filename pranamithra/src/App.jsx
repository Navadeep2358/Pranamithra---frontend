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
import MyAppointments from "./doctor/MyAppointments";

import AdminHome from "./admin/AdminHome";
import AuthModal from "./components/AuthModal";
import Profile from "./components/Profile";

import BotMithra from "./chatbot/BotMithra";
import HeartLoader from "./components/HeartLoader";

import "./App.css";

const API = "http://localhost:3000";

export default function App() {

  const [sideOpen, setSideOpen] = useState(false);
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const [loading, setLoading] = useState(true);

  /* GLOBAL ACTION LOADER */
  const [actionLoading, setActionLoading] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [doctorPage, setDoctorPage] = useState("home");
  const [customerPage, setCustomerPage] = useState("home");

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);

  /* ================= BOT AUTH LISTENER ================= */

  useEffect(() => {

    const handleOpenAuth = (event) => {
      setAuth(event.detail);
    };

    window.addEventListener("open-auth-modal", handleOpenAuth);

    return () => {
      window.removeEventListener("open-auth-modal", handleOpenAuth);
    };

  }, []);

  /* ================= BOT NAVIGATION ================= */

  useEffect(() => {

    const handleGoToAppointments = () => {
      navigateDoctor("appointments");
    };

    window.addEventListener(
      "go-to-doctor-appointments",
      handleGoToAppointments
    );

    return () => {
      window.removeEventListener(
        "go-to-doctor-appointments",
        handleGoToAppointments
      );
    };

  }, []);

  /* ================= SESSION CHECK ================= */

  useEffect(() => {

    fetch(`${API}/me`, {
      credentials: "include"
    })
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data) setUser(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

  }, []);

  /* ================= INITIAL HISTORY ================= */

  useEffect(() => {

    window.history.replaceState(
      {
        role: null,
        customerPage: "home",
        doctorPage: "home",
        showProfile: false
      },
      "",
      window.location.href
    );

  }, []);

  /* ================= NAVIGATION ================= */

  const pushHistory = (newState) => {
    window.history.pushState(newState, "", "");
  };

  const navigateCustomer = (page) => {

    pushHistory({
      role: "customer",
      customerPage: page,
      doctorPage,
      showProfile: false
    });

    setCustomerPage(page);
    setShowProfile(false);
  };

  const navigateDoctor = (page) => {

    pushHistory({
      role: "doctor",
      doctorPage: page,
      customerPage,
      showProfile: false
    });

    setDoctorPage(page);
    setShowProfile(false);
  };

  const navigateProfile = () => {

    pushHistory({
      role: user?.role,
      doctorPage,
      customerPage,
      showProfile: true
    });

    setShowProfile(true);
  };

  /* ================= BACK BUTTON ================= */

  useEffect(() => {

    const handlePopState = (event) => {

      if (!event.state) return;

      const state = event.state;

      if (state.customerPage) {
        setCustomerPage(state.customerPage);
      }

      if (state.doctorPage) {
        setDoctorPage(state.doctorPage);
      }

      setShowProfile(state.showProfile || false);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };

  }, []);

  /* ================= INITIAL APP LOADER ================= */

  if (loading) {
    return <HeartLoader />;
  }

  return (

    <div className={`app ${theme}`}>

      {/* GLOBAL ACTION LOADER */}
      {actionLoading && <HeartLoader />}

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
          setShowProfile={navigateProfile}

          setShowMySchedules={() => navigateDoctor("myschedules")}
          setShowMyAppointments={() => navigateDoctor("appointments")}
          setShowAppointmentCost={() => navigateDoctor("appointmentcost")}
          setShowMyBookings={() => navigateCustomer("mybookings")}

          onDoctorLogin={() =>
            setAuth({ type: "Login", role: "doctor" })
          }

          onDoctorRegister={() =>
            setAuth({ type: "Register", role: "doctor" })
          }

          onLogout={async () => {

            setActionLoading(true);

            await fetch(`${API}/logout`, {
              method: "POST",
              credentials: "include"
            });

            setSideOpen(false);
            setUser(null);

            setDoctorPage("home");
            setCustomerPage("home");

            setShowProfile(false);

            setActionLoading(false);
          }}

        />

      )}

      {auth && (

        <AuthModal
  type={auth.type}
  role={auth.role}
  onClose={() => setAuth(null)}
  setActionLoading={setActionLoading}

  onSuccess={(data) => {

    setActionLoading(true);

    setTimeout(() => {

      setUser(data);
      setAuth(null);
      setSideOpen(false);

      setActionLoading(false);

    }, 800);

  }}
/>
      )}

      {!showProfile && !user && <Home />}

      {/* CUSTOMER */}

      {user?.role === "customer" && !showProfile && (

        <>

          {customerPage === "home" && (

            <CustomerHome
              user={user}
              openBookAppointment={() => navigateCustomer("book")}
              openMyBookings={() => navigateCustomer("mybookings")}
            />

          )}

          {customerPage === "book" && (

            <FindDoctor
              goBack={() => window.history.back()}
              openAppointment={(doctorId) => {

                setSelectedDoctorId(doctorId);

                navigateCustomer("appointment");

              }}
            />

          )}

          {customerPage === "appointment" && (

            <AppointmentPage
              doctorId={selectedDoctorId}
              goBack={() => window.history.back()}
              setActionLoading={setActionLoading}
            />

          )}

          {customerPage === "mybookings" && (

            <MyBookings
              goBack={() => window.history.back()}
            />

          )}

        </>

      )}

      {/* DOCTOR */}

      {user?.role === "doctor" && !showProfile && (

        <>

          {doctorPage === "home" && (

            <DoctorHome
              user={user}
              openSchedule={() => navigateDoctor("schedule")}
              openAppointments={() => navigateDoctor("appointments")}
            />

          )}

          {doctorPage === "schedule" && (

            <ScheduleDay
              user={user}
              goBack={() => window.history.back()}
            />

          )}

          {doctorPage === "myschedules" && (

            <MySchedules
              user={user}
              goBack={() => window.history.back()}
            />

          )}

          {doctorPage === "appointmentcost" && (

            <AppointmentCost
              user={user}
              goBack={() => window.history.back()}
            />

          )}

          {doctorPage === "appointments" && (

            <MyAppointments
              doctor={user}
              goBack={() => window.history.back()}
            />

          )}

        </>

      )}

      {user?.role === "admin" && !showProfile && <AdminHome />}

      {showProfile && (

        <Profile
          user={user}
          goBack={() => window.history.back()}
          setActionLoading={setActionLoading}
        />

      )}

      <BotMithra user={user} />

    </div>

  );
}