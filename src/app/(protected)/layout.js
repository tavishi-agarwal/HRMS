import AppShell from "@/modules/layout/AppShell";

export default function ProtectedLayout({ children }) {
  return <AppShell>{children}</AppShell>;
}
