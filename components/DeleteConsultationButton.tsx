"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeleteConsultationButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm("이 상담신청을 삭제하시겠습니까?");
    if (!confirmed) return;

    const { error } = await supabase
      .from("consultations")
      .delete()
      .eq("id", id);

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
