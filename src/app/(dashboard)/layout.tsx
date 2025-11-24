import { AppDashboardShell } from "@/components/dashboard-shell/dashboard-shell";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppDashboardShell>{children}</AppDashboardShell>;
}
