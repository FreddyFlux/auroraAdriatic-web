import AdminBreadcrumb from "@/components/admin-breadcrumb";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <AdminBreadcrumb />
        </div>
        {children}
      </div>
    </div>
  );
}
