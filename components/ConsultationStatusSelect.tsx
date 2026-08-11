"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Status = "신규" | "상담중" | "완료";

export default function ConsultationStatusSelect({
  id,
  currentStatus,
}: {
  id: number;
  currentStatus: Status;
}) {
  const [status, setStatus] = useState<Status>(currentStatus);
  const [saving, setSaving] = useState(false);

  async function updateStatus(nextStatus: Status) {
    setStatus(nextStatus);
    setSaving(true);

    const { error } = await supabase
      .from("consultations")
      .update({ status: nextStatus })
      .eq("id", id);

    setSaving(false);

    if (error) {
      alert(`상태 변경 실패: ${error.message}`);
      setStatus(currentStatus);
    }
  }

  return (
    <select
      value={status}
      disabled={saving}
      onChange={(event) => updateStatus(event.target.value as Status)}
      className="dy-consult-status-select"
    >
      <option value="신규">신규</option>
      <option value="상담중">상담중</option>
      <option value="완료">완료</option>
    </select>
  );
}
