import Link from "next/link";
import AdminBulkPropertyUpload from "@/components/AdminBulkPropertyUpload";

export default function AdminBulkPage() {
  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>엑셀 매물 대량등록</h1>
          <p>
            엑셀 한 행당 매물 1개가 등록됩니다. 사진은 등록 후 수정 화면에서
            추가하세요.
          </p>
        </div>

        <Link href="/admin" className="admin-back-button">
          목록으로
        </Link>
      </div>

      <AdminBulkPropertyUpload />
    </main>
  );
}
