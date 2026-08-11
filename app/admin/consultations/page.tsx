import { supabase } from "@/lib/supabase";
import type { ConsultationRow } from "@/lib/consultationTypes";
import ConsultationStatusSelect from "@/components/ConsultationStatusSelect";
import DeleteConsultationButton from "@/components/DeleteConsultationButton";

export const dynamic = "force-dynamic";

export default async function ConsultationsAdminPage() {
  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .order("id", { ascending: false });

  const consultations = (data ?? []) as ConsultationRow[];

  return (
    <main className="admin-page">
      <div className="admin-header">
        <div>
          <h1>상담신청 관리</h1>
          <p>
            접수된 상담신청을 확인하고 상태를 관리합니다.
          </p>
        </div>
      </div>

      {error && (
        <p className="admin-error">
          불러오기 실패: {error.message}
        </p>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>접수일</th>
              <th>이름</th>
              <th>연락처</th>
              <th>문의내용</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {consultations.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  {new Date(
                    item.created_at,
                  ).toLocaleString("ko-KR")}
                </td>

                <td>{item.name || "-"}</td>

                <td>
                  <a href={`tel:${item.phone}`}>
                    {item.phone}
                  </a>
                </td>

                <td className="dy-consult-message-cell">
                  {item.message}
                </td>

                <td>
                  <ConsultationStatusSelect
                    id={item.id}
                    currentStatus={item.status}
                  />
                </td>

                <td>
                  <DeleteConsultationButton
                    id={item.id}
                  />
                </td>
              </tr>
            ))}

            {consultations.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="admin-empty"
                >
                  아직 접수된 상담신청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}