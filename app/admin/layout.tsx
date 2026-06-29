import AdminLayout from "@/components/admin/AdminLayout";
import QueryProvider from "@/components/providers/QueryProvider";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <AdminLayout>{children}</AdminLayout>
    </QueryProvider>
  );
}
