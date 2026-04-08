import AdminPages from "@/Admin/AdminPages/AdminPages";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminPages>{children}</AdminPages>;
}
