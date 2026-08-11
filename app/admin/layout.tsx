import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ADMIN_COOKIE_NAME,
  verifyAdminSessionToken,
} from "@/lib/adminAuth";
import AdminSidebar from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    ADMIN_COOKIE_NAME,
  )?.value;

  const isAdmin =
    verifyAdminSessionToken(token);

  if (!isAdmin) {
    redirect("/admin-login");
  }

  return (
    <div className="dy-admin-shell">
      <AdminSidebar />

      <section className="dy-admin-content">
        {children}
      </section>

      <style>{`
        .dy-admin-shell {
          min-height: 100vh;
          display: flex;
          align-items: flex-start;
          background: #f5f6f8;
        }

        .dy-admin-content {
          flex: 1;
          min-width: 0;
          padding: 34px;
          box-sizing: border-box;
        }

        .dy-admin-content .admin-page {
          width: 100%;
          max-width: 1500px;
          margin: 0 auto;
        }

        @media (max-width: 900px) {
          .dy-admin-shell {
            flex-direction: column;
          }

          .dy-admin-content {
            width: 100%;
            padding: 18px;
          }
        }
      `}</style>
    </div>
  );
}
