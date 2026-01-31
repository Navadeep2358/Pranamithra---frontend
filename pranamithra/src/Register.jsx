import React, { useState } from "react";

function Register({ setPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role })
    });

    const msg = await res.text();
    alert(msg);

    if (msg.includes("Successful")) {
      setPage("login");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} required />
      <br /><br />

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <br /><br />

      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <br /><br />

      <select onChange={e => setRole(e.target.value)} required>
        <option value="">Select Role</option>
        <option value="admin">Admin</option>
        <option value="doctor">Doctor</option>
        <option value="user">User</option>
      </select>
      <br /><br />

      <button type="submit">Register</button>
      <br /><br />

      <button type="button" onClick={() => setPage("home")}>Back</button>
    </form>
  );
}

export default Register;
