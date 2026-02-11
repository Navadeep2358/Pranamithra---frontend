export default function CustomerHome({ user }) {
  return (
    <div style={{ padding: "40px" }}>
      <h1>Customer Dashboard</h1>
      <p>Welcome, {user?.name || "Customer"}</p>
    </div>
  );
}
