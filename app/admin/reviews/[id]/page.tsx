import Link from "next/link";
import { notFound } from "next/navigation";
import AdminReviewForm from "@/components/AdminReviewForm";
import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/reviewTypes";

export const dynamic = "force-dynamic";

export default async function EditReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !data) notFound();

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>고객후기 수정</h1>
          <p>후기 내용과 사진을 수정합니다.</p>
        </div>

        <Link href="/admin/reviews" className="admin-back-button">
          목록으로
        </Link>
      </div>

      <AdminReviewForm review={data as ReviewRow} />
    </main>
  );
}
