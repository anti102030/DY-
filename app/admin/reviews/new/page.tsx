import Link from "next/link";
import AdminReviewForm from "@/components/AdminReviewForm";

export default function NewReviewPage() {
  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>고객후기 등록</h1>
          <p>사진과 후기 내용을 등록합니다.</p>
        </div>

        <Link href="/admin/reviews" className="admin-back-button">
          목록으로
        </Link>
      </div>

      <AdminReviewForm />
    </main>
  );
}
