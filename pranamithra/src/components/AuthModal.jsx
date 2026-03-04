import { useState, useEffect } from "react";
import "./AuthModal.css";

const API = "http://localhost:3000";

export default function AuthModal({ type, role, onClose, onSuccess, setActionLoading }) {

  const [currentType, setCurrentType] = useState(type);

  useEffect(() => {
    setCurrentType(type);
  }, [type]);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [doctorImage, setDoctorImage] = useState(null);
  const [hospitalImage, setHospitalImage] = useState(null);

  const [popup, setPopup] = useState(null);
  const [fadeOut, setFadeOut] = useState(false);

  const showPopup = (message, type) => {
    setPopup({ message, type });
    setFadeOut(false);

    setTimeout(() => setFadeOut(true), 4200);
    setTimeout(() => {
      setPopup(null);
      setFadeOut(false);
    }, 5000);
  };

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  /* ================= LOGIN ================= */

 const handleLogin = async () => {

  const loginRole =
    email === "admin@gmail.com" ? "admin" : role;

  // close modal
  onClose();

  // start loader
  setActionLoading(true);

  try {

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: loginRole, email, password })
    });

    if (res.ok) {

      const data = await res.json();

      // set user immediately
      onSuccess(data);

      // keep loader visible for 3 seconds
      setTimeout(() => {
        setActionLoading(false);
      }, 3000);

    } else {

      setActionLoading(false);
      alert("Invalid Credentials");

    }

  } catch {

    setActionLoading(false);
    alert("Server Error");

  }
};

  /* ================= REGISTER ================= */

  const handleRegister = async () => {

    if (password !== confirmPassword) {
      showPopup("Passwords do not match", "error");
      return;
    }

    // close modal
    onClose();

    // start loader
    setActionLoading(true);

    try {

      if (role === "customer") {

        const res = await fetch(`${API}/customer/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            fullName,
            phone,
            email,
            password,
            dob,
            age,
            address,
            gender
          })
        });

        if (res.ok) {

          setTimeout(() => {
            setActionLoading(false);
          }, 900);

        } else {

          setActionLoading(false);
          alert("Registration Failed");

        }

        return;
      }

      const fd = new FormData();
      fd.append("fullName", fullName);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("password", password);
      fd.append("hospitalName", hospitalName);
      fd.append("hospitalAddress", hospitalAddress);
      fd.append("specialization", specialization);
      fd.append("experience", experience);
      fd.append("doctorImage", doctorImage);
      fd.append("hospitalImage", hospitalImage);

      const res = await fetch(`${API}/doctor/register`, {
        method: "POST",
        credentials: "include",
        body: fd
      });

      if (res.ok) {

        setTimeout(() => {
          setActionLoading(false);
        }, 900);

      } else {

        setActionLoading(false);
        alert("Registration Failed");

      }

    } catch {

      setActionLoading(false);
      alert("Server Error");

    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">

        <div className="auth-header">
          <h2>{currentType} as {role}</h2>

          <button
            className="auth-close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="auth-content">

          {currentType === "Login" && (
            <>
              <input
                placeholder="Email"
                onChange={e => setEmail(e.target.value)}
              />

              <input
                type="password"
                placeholder="Password"
                onChange={e => setPassword(e.target.value)}
              />

              <div className="switch-link">
                New user?
                <span onClick={() => setCurrentType("Register")}>
                  Register here
                </span>
              </div>
            </>
          )}

          {currentType === "Register" && role === "customer" && (
            <>
              <input placeholder="Full Name" onChange={e => setFullName(e.target.value)} />
              <input placeholder="Phone Number" onChange={e => setPhone(e.target.value)} />
              <input placeholder="Email" onChange={e => setEmail(e.target.value)} />

              <div className="two-col">
                <input type="date" onChange={e => setDob(e.target.value)} />
                <input placeholder="Age" onChange={e => setAge(e.target.value)} />
              </div>

              <select onChange={e => setGender(e.target.value)}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <textarea placeholder="Address" onChange={e => setAddress(e.target.value)} />

              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />

              <div className="switch-link">
                Already have an account?
                <span onClick={() => setCurrentType("Login")}>
                  Login here
                </span>
              </div>
            </>
          )}

          {currentType === "Register" && role === "doctor" && (
            <>
              <input placeholder="Doctor Name" onChange={e => setFullName(e.target.value)} />
              <input placeholder="Phone Number" onChange={e => setPhone(e.target.value)} />
              <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input placeholder="Hospital Name" onChange={e => setHospitalName(e.target.value)} />
              <input placeholder="Hospital Address" onChange={e => setHospitalAddress(e.target.value)} />

              <select onChange={e => setSpecialization(e.target.value)}>
                <option value="">Select Specialization</option>
                <option value="cardiology">Cardiology</option>
                <option value="ent">ENT</option>
                <option value="neurology">Neurology</option>
                <option value="dentist">Dentist</option>
                <option value="general">General Physician</option>
              </select>

              <input
                type="number"
                placeholder="Years of Experience"
                onChange={e => setExperience(e.target.value)}
              />

              <label className="file-label">
                Doctor Image
                <input type="file" onChange={e => setDoctorImage(e.target.files[0])} />
              </label>

              <label className="file-label">
                Hospital Image
                <input type="file" onChange={e => setHospitalImage(e.target.files[0])} />
              </label>

              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
              <input type="password" placeholder="Confirm Password" onChange={e => setConfirmPassword(e.target.value)} />

              <div className="switch-link">
                Already have an account?
                <span onClick={() => setCurrentType("Login")}>
                  Login here
                </span>
              </div>
            </>
          )}

        </div>

        <button
          className="auth-btn"
          onClick={currentType === "Login" ? handleLogin : handleRegister}
        >
          {currentType}
        </button>

      </div>
    </div>
  );
}