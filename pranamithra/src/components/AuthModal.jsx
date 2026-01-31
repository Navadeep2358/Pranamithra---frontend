import { useState } from "react";
import "./AuthModal.css";

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
  const [specialization, setSpecialization] = useState("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        role: role.toLowerCase(),
        email,
        password
      })
    });

    const data = await res.json();
    if (res.ok) onSuccess(data);
    else alert("Invalid credentials");
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const url =
      role === "Customer"
        ? "http://localhost:3000/customer/register"
        : "http://localhost:3000/doctor/register";

    const payload =
      role === "Customer"
        ? { fullName, phone, email, password, dob, age, address, gender }
        : { fullName, phone, email, password, hospitalName, specialization };

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const msg = await res.text();
    alert(msg);
    if (res.ok) onClose();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">

        <div className="auth-header">
          <h2>{role} {type}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="auth-body">

          {type === "Login" && (
            <>
              <div className="field">
                <label>Email</label>
                <input onChange={e => setEmail(e.target.value)} />
              </div>

              <div className="field">
                <label>Password</label>
                <input type="password" onChange={e => setPassword(e.target.value)} />
              </div>
            </>
          )}

          {type === "Register" && role === "Customer" && (
            <>
              <div className="field"><label>Full Name</label><input onChange={e => setFullName(e.target.value)} /></div>
              <div className="field"><label>Phone</label><input onChange={e => setPhone(e.target.value)} /></div>
              <div className="field"><label>Email</label><input onChange={e => setEmail(e.target.value)} /></div>
              <div className="field"><label>Date of Birth</label><input type="date" onChange={e => setDob(e.target.value)} /></div>
              <div className="field"><label>Age</label><input onChange={e => setAge(e.target.value)} /></div>
              <div className="field"><label>Gender</label>
                <select onChange={e => setGender(e.target.value)}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
              <div className="field"><label>Address</label><textarea onChange={e => setAddress(e.target.value)} /></div>
              <div className="field"><label>Password</label><input type="password" onChange={e => setPassword(e.target.value)} /></div>
              <div className="field"><label>Confirm Password</label><input type="password" onChange={e => setConfirmPassword(e.target.value)} /></div>
            </>
          )}

          {type === "Register" && role === "Doctor" && (
            <>
              <div className="field"><label>Doctor Name</label><input onChange={e => setFullName(e.target.value)} /></div>
              <div className="field"><label>Phone</label><input onChange={e => setPhone(e.target.value)} /></div>
              <div className="field"><label>Email</label><input onChange={e => setEmail(e.target.value)} /></div>
              <div className="field"><label>Hospital Name</label><input onChange={e => setHospitalName(e.target.value)} /></div>
              <div className="field"><label>Specialization</label>
                <select onChange={e => setSpecialization(e.target.value)}>
                  <option value="">Select</option>
                  <option value="cardiology">Cardiology</option>
                  <option value="ent">ENT</option>
                  <option value="neurology">Neurology</option>
                  <option value="dentist">Dentist</option>
                  <option value="general">General Physician</option>
                </select>
              </div>
              <div className="field"><label>Password</label><input type="password" onChange={e => setPassword(e.target.value)} /></div>
              <div className="field"><label>Confirm Password</label><input type="password" onChange={e => setConfirmPassword(e.target.value)} /></div>
            </>
          )}

        </div>

        <div className="auth-footer">
          <button className="auth-submit" onClick={type === "Login" ? handleLogin : handleRegister}>
            {type}
          </button>
        </div>

      </div>
    </div>
  )
}
