import Link from "next/link";
import AdminPropertyForm from "@/components/AdminPropertyForm";

export default function NewPropertyPage() {
  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>새 매물 등록</h1>
          <p>다이아주택에 노출할 매물 정보를 입력하세요.</p>
        </div>

        <Link href="/admin" className="admin-back-button">
          목록으로
        </Link>
      </div>

      <AdminPropertyForm />
    </main>
  );
}
