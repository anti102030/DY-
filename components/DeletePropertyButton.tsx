"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function DeletePropertyButton({ id }: { id: number }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteProperty() {
    const confirmed = window.confirm("이 매물을 삭제할까요?");
    if (!confirmed) return;

    setDeleting(true);
    const { error } = await supabase.from("properties").delete().eq("id", id);
    setDeleting(false);

    if (error) {
      window.alert(`삭제 실패: ${error.message}`);
      return;
    }

    router.refresh();
  }

  return (
    <button
      type="button"
      className="admin-delete-button"
      onClick={deleteProperty}
      disabled={deleting}
    >
      {deleting ? "삭제 중..." : "삭제"}
    </button>
  );
}
