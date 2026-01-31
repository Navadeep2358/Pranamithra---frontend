import React, { useState } from "react";

function Login({ setPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    });

    if (res.redirected) {
      setPage("success");
    } else {
      const msg = await res.text();
      alert(msg);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input placeholder="Email" onChange={e => setEmail(e.target.value)} required />
      <br /><br />

      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
      <br /><br />

      <button type="submit">Login</button>
      <br /><br />

      <button type="button" onClick={() => setPage("home")}>Back</button>
    </form>
  );
}

export default Login;
