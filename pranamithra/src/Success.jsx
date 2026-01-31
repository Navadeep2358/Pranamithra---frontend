export default function Success({ user }) {
  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h1>✅ Successfully Logged In</h1>
      <h2>Welcome {user.name}</h2>
      <p>Role: {user.role}</p>
    </div>
  )
}
