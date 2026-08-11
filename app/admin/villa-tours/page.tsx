import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type VillaTourRow = {
  id: number;
  region: string;
  price_range: string;
  property_types: string[] | null;
  move_date: string | null;
  tour_date: string | null;
  tour_time: string | null;
  name: string;
  phone: string;
  message: string | null;
  attachment_url: string | null;
  status: string;
  admin_memo: string | null;
  created_at: string;
};

const STATUS_OPTIONS = [
  "신청접수",
  "연락완료",
  "일정확정",
  "투어진행",
  "완료",
  "취소",
];

function formatDateTime(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function updateVillaTour(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const status = String(formData.get("status") ?? "신청접수");
  const adminMemo = String(formData.get("admin_memo") ?? "").trim();

  if (!Number.isFinite(id)) {
    return;
  }

  await supabaseAdmin
    .from("villa_tours")
    .update({
      status,
      admin_memo: adminMemo || null,
    })
    .eq("id", id);

  revalidatePath("/admin/villa-tours");
}

async function deleteVillaTour(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));

  if (!Number.isFinite(id)) {
    return;
  }

  await supabaseAdmin
    .from("villa_tours")
    .delete()
    .eq("id", id);

  revalidatePath("/admin/villa-tours");
}

export default async function AdminVillaToursPage() {
  const { data, error } = await supabaseAdmin
    .from("villa_tours")
    .select("*")
    .order("id", { ascending: false });

  const tours = (data ?? []) as VillaTourRow[];

  return (
    <main className="admin-page dy-villa-admin-page">
      <div className="admin-header">
        <div>
          <h1>빌라투어 신청 관리</h1>
          <p>
            접수된 빌라투어 신청을 확인하고 상태와 관리자 메모를 관리합니다.
          </p>
        </div>
      </div>

      {error && (
        <p className="admin-error">
          불러오기 실패: {error.message}
        </p>
      )}

      <div className="dy-villa-summary">
        <div>
          <span>전체 신청</span>
          <strong>{tours.length}</strong>
        </div>

        <div>
          <span>신청접수</span>
          <strong>
            {tours.filter((item) => item.status === "신청접수").length}
          </strong>
        </div>

        <div>
          <span>일정확정</span>
          <strong>
            {tours.filter((item) => item.status === "일정확정").length}
          </strong>
        </div>

        <div>
          <span>완료</span>
          <strong>
            {tours.filter((item) => item.status === "완료").length}
          </strong>
        </div>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table dy-villa-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>접수일</th>
              <th>신청자</th>
              <th>연락처</th>
              <th>희망지역</th>
              <th>가격범위</th>
              <th>주택종류</th>
              <th>투어일정</th>
              <th>상태 / 메모</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {tours.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>

                <td>
                  {formatDateTime(item.created_at)}
                </td>

                <td>
                  <strong>{item.name}</strong>
                </td>

                <td>
                  <a href={`tel:${item.phone}`}>
                    {item.phone}
                  </a>
                </td>

                <td>{item.region}</td>

                <td>{item.price_range}</td>

                <td>
                  {(item.property_types ?? []).length > 0
                    ? (item.property_types ?? []).join(", ")
                    : "-"}
                </td>

                <td>
                  <div className="dy-tour-date-cell">
                    <strong>
                      {item.tour_date || "-"}
                    </strong>

                    <span>
                      {item.tour_time || "-"}
                    </span>

                    {item.move_date && (
                      <small>
                        이사예정 {item.move_date}
                      </small>
                    )}
                  </div>
                </td>

                <td>
                  <form
                    action={updateVillaTour}
                    className="dy-villa-manage-form"
                  >
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <select
                      name="status"
                      defaultValue={item.status}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>

                    <textarea
                      name="admin_memo"
                      defaultValue={item.admin_memo ?? ""}
                      placeholder="관리자 메모"
                    />

                    {item.message && (
                      <div className="dy-customer-message">
                        <b>고객요청</b>
                        <span>{item.message}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="dy-save-button"
                    >
                      저장
                    </button>
                  </form>
                </td>

                <td>
                  <form action={deleteVillaTour}>
                    <input
                      type="hidden"
                      name="id"
                      value={item.id}
                    />

                    <button
                      type="submit"
                      className="dy-delete-button"
                    >
                      삭제
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {tours.length === 0 && !error && (
              <tr>
                <td
                  colSpan={10}
                  className="admin-empty"
                >
                  아직 접수된 빌라투어 신청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .dy-villa-admin-page {
          width: 100%;
        }

        .dy-villa-summary {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin: 22px 0;
        }

        .dy-villa-summary > div {
          padding: 18px;
          border: 1px solid #ddd;
          border-radius: 7px;
          background: #fff;
        }

        .dy-villa-summary span {
          display: block;
          color: #777;
          font-size: 12px;
          font-weight: 700;
        }

        .dy-villa-summary strong {
          display: block;
          margin-top: 7px;
          color: #111;
          font-size: 26px;
          font-weight: 900;
        }

        .dy-villa-table {
          min-width: 1450px;
        }

        .dy-tour-date-cell {
          display: flex;
          flex-direction: column;
          gap: 4px;
          white-space: nowrap;
        }

        .dy-tour-date-cell span {
          color: #555;
        }

        .dy-tour-date-cell small {
          color: #888;
          font-size: 11px;
        }

        .dy-villa-manage-form {
          width: 260px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dy-villa-manage-form select {
          width: 100%;
          height: 34px;
          padding: 0 8px;
          border: 1px solid #ccc;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-villa-manage-form textarea {
          width: 100%;
          min-height: 66px;
          padding: 8px;
          border: 1px solid #ccc;
          resize: vertical;
          box-sizing: border-box;
          font-size: 12px;
        }

        .dy-customer-message {
          padding: 8px;
          background: #f7f7f7;
          border: 1px solid #e5e5e5;
          text-align: left;
          font-size: 11px;
          line-height: 1.5;
        }

        .dy-customer-message b {
          display: block;
          margin-bottom: 3px;
        }

        .dy-customer-message span {
          display: block;
          white-space: normal;
          word-break: break-word;
        }

        .dy-save-button,
        .dy-delete-button {
          min-height: 32px;
          border: 0;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .dy-save-button {
          background: #333;
          color: #fff;
        }

        .dy-delete-button {
          min-width: 54px;
          padding: 0 12px;
          background: #d9534f;
          color: #fff;
        }

        @media (max-width: 900px) {
          .dy-villa-summary {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .dy-villa-summary {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
