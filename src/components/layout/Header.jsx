"use client";

export default function Header() {
  return (
    <div style={{
      height: 60,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0 20px",
      borderBottom: "1px solid #ddd",
      background: "#fff"
    }}>
      <h3>HRMS Dashboard</h3>

      <div style={{ display: "flex", gap: 10 }}>
        <button>Apply Leave</button>
        <button>Claims</button>
        <button>Notifications</button>
      </div>
    </div>
  );
}