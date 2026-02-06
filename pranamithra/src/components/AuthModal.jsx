import { useState } from "react";
import "./AuthModal.css";

export default function AuthModal({ type, role, onClose, onSuccess }) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Customer
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");

  // Doctor
  const [hospitalName, setHospitalName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [doctorImage, setDoctorImage] = useState(null);
  const [hospitalImage, setHospitalImage] = useState(null);

  /* ================= LOGIN ================= */
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

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // CUSTOMER REGISTER (JSON)
    if (role === "Customer") {
      const res = await fetch("http://localhost:3000/customer/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      const msg = await res.text();
      alert(msg);
      if (res.ok) onClose();
      return;
    }

    // DOCTOR REGISTER (FORM DATA)
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("hospitalName", hospitalName);
    formData.append("specialization", specialization);
    formData.append("doctorImage", doctorImage);
    formData.append("hospitalImage", hospitalImage);

    const res = await fetch("http://localhost:3000/doctor/register", {
      method: "POST",
      body: formData
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

          {/* LOGIN */}
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

          {/* CUSTOMER REGISTER */}
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

          {/* DOCTOR REGISTER */}
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

              <div className="field">
                <label>Doctor Image</label>
                <input type="file" accept="image/*" onChange={e => setDoctorImage(e.target.files[0])} />
              </div>

              <div className="field">
                <label>Hospital Image</label>
                <input type="file" accept="image/*" onChange={e => setHospitalImage(e.target.files[0])} />
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
