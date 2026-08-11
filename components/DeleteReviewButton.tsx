"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteReviewButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("이 고객후기를 삭제하시겠습니까?");
    if (!confirmed) return;

    const { error } = await supabase.from("reviews").delete().eq("id", id);

    if (error) {
      alert(`삭제 실패: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      className="admin-delete-button"
      onClick={handleDelete}
    >
      삭제
    </button>
  );
}
