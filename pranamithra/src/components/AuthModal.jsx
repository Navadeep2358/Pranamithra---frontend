import { useState, useEffect } from "react";
import "./AuthModal.css";

/* ===== LOCALHOST BACKEND ===== */
const API = "http://localhost:3000";

export default function AuthModal({ type, role, onClose, onSuccess }) {

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

    const res = await fetch(`${API}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: loginRole, email, password })
    });

    if (res.ok) {
      const data = await res.json();
      showPopup("Login Successful", "success");
      setTimeout(() => onSuccess(data), 1200);
    } else {
      showPopup("Invalid Credentials", "error");
    }
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {

    if (password !== confirmPassword) {
      showPopup("Passwords do not match", "error");
      return;
    }

    // CUSTOMER REGISTER
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
        showPopup("Your Registration is Successful", "success");
        setTimeout(() => onClose(), 1500);
      } else {
        showPopup("Registration Failed", "error");
      }

      return;
    }

    // DOCTOR REGISTER
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
      showPopup("Your Registration is Successful", "success");
      setTimeout(() => onClose(), 1500);
    } else {
      showPopup("Registration Failed", "error");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">

        {popup && (
          <div className={`auth-popup ${popup.type} ${fadeOut ? "fade-out" : ""}`}>
            <div className="popup-icon">
              {popup.type === "success" && "✓"}
              {popup.type === "error" && "✕"}
              {popup.type === "cancel" && "⚠"}
            </div>
            <div className="popup-text">
              {popup.message}
            </div>
          </div>
        )}

        <div className="auth-header">
          <h2>{type} as {role}</h2>
          <button
            className="auth-close"
            onClick={() => {
              showPopup("Action Cancelled", "cancel");
              setTimeout(() => onClose(), 800);
            }}
          >
            ✕
          </button>
        </div>

        <div className="auth-content">

          {type === "Login" && (
            <>
              <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </>
          )}

          {type === "Register" && role === "customer" && (
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
            </>
          )}

          {type === "Register" && role === "doctor" && (
            <>
              <input placeholder="Doctor Name" onChange={e => setFullName(e.target.value)} />
              <input placeholder="Phone Number" onChange={e => setPhone(e.target.value)} />
              <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input placeholder="Hospital Name" onChange={e => setHospitalName(e.target.value)} />
              <input
                placeholder="Hospital Address"
                onChange={e => setHospitalAddress(e.target.value)}
              />

              <select onChange={e => setSpecialization(e.target.value)}>
                <option value="">Select Specialization</option>
                <option value="cardiology">Cardiology</option>
                <option value="ent">ENT</option>
                <option value="neurology">Neurology</option>
                <option value="dentist">Dentist</option>
                <option value="general">General Physician</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="dermatology">Dermatology</option>
                <option value="pediatrics">Pediatrics</option>
                <option value="gynecology">Gynecology</option>
                <option value="psychiatry">Psychiatry</option>
                <option value="urology">Urology</option>
                <option value="oncology">Oncology</option>
                <option value="gastroenterology">Gastroenterology</option>
                <option value="nephrology">Nephrology</option>
                <option value="pulmonology">Pulmonology</option>
                <option value="radiology">Radiology</option>
                <option value="anesthesiology">Anesthesiology</option>
                <option value="endocrinology">Endocrinology</option>
                <option value="ophthalmology">Ophthalmology</option>
                <option value="plastic_surgery">Plastic Surgery</option>
              </select>

              <input
                type="number"
                placeholder="Years of Experience"
                min="0"
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
            </>
          )}

        </div>

        <button className="auth-btn" onClick={type === "Login" ? handleLogin : handleRegister}>
          {type}
        </button>

      </div>
    </div>
  );
}