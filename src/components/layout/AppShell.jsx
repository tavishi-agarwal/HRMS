import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AppShell({ children }) {
  return (
    <>
      <Sidebar />
      <main className="ml-[260px] min-h-screen bg-[#f8f9ff]">
        <Header />
        {children}
      </main>
    </>
  );
}