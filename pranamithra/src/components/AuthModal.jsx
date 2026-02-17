import { useState, useEffect } from "react";
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

  /* 🔒 LOCK BODY SCROLL */
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = prev);
  }, []);

  /* ================= LOGIN ================= */
  const handleLogin = async () => {
    const loginRole =
      email === "admin@gmail.com" ? "admin" : role;

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role: loginRole, email, password })
    });

    const data = await res.json();
    res.ok ? onSuccess(data) : alert("Invalid credentials");
  };

  /* ================= REGISTER ================= */
  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // CUSTOMER
    if (role === "customer") {
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

      alert(await res.text());
      res.ok && onClose();
      return;
    }

    // DOCTOR
    const fd = new FormData();
    fd.append("fullName", fullName);
    fd.append("phone", phone);
    fd.append("email", email);
    fd.append("password", password);
    fd.append("hospitalName", hospitalName);
    fd.append("specialization", specialization);
    fd.append("doctorImage", doctorImage);
    fd.append("hospitalImage", hospitalImage);

    const res = await fetch("http://localhost:3000/doctor/register", {
      method: "POST",
      body: fd
    });

    alert(await res.text());
    res.ok && onClose();
  };

  return (
    <div className="auth-overlay">
      <div className="auth-modal">

        {/* HEADER */}
        <div className="auth-header">
          <h2>{type} as {role}</h2>
          <button className="auth-close" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="auth-content">

          {/* LOGIN */}
          {type === "Login" && (
            <>
              <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
            </>
          )}

          {/* CUSTOMER REGISTER */}
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

          {/* DOCTOR REGISTER */}
          {type === "Register" && role === "doctor" && (
            <>
              <input placeholder="Doctor Name" onChange={e => setFullName(e.target.value)} />
              <input placeholder="Phone Number" onChange={e => setPhone(e.target.value)} />
              <input placeholder="Email" onChange={e => setEmail(e.target.value)} />
              <input placeholder="Hospital Name" onChange={e => setHospitalName(e.target.value)} />

              <select onChange={e => setSpecialization(e.target.value)}>
                <option value="">Select Specialization</option>
                <option value="cardiology">Cardiology</option>
                <option value="ent">ENT</option>
                <option value="neurology">Neurology</option>
                <option value="dentist">Dentist</option>
                <option value="general">General Physician</option>
                <option value="Gastroenterologists">Gastroenterologists</option>
                <option value="Nephrologists">Nephrologists</option>
                <option value="gynecologists">gynecologists</option>
                <option value="Ophthalmologists">Ophthalmologists</option>
                <option value="Dermatologists">Dermatologists</option>
                <option value="Anesthesiologists">Anesthesiologists</option>
                <option value="Endocrinologists">Endocrinologists</option>
                <option value="Hematologists">Hematologists</option>
                <option value="Orthopedic">Orthopedic</option>
                <option value="Psychiatrists">Psychiatrists</option>
                <option value="Radiologists">Radiologists</option>

              </select>

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

        {/* FOOTER */}
        <button className="auth-btn" onClick={type === "Login" ? handleLogin : handleRegister}>
          {type}
        </button>
      </div>
    </div>
  );
}
