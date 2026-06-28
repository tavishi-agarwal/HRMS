import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />

        <main style={{ padding: 20, overflow: "auto" }}>
          {children}
        </main>
      </div>

    </div>
  );
}