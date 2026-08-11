import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import type { PropertyRow } from "@/lib/propertyTypes";
import DeletePropertyButton from "@/components/DeletePropertyButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPropertiesPage() {
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("*")
    .order("id", { ascending: false });

  const properties = (data ?? []) as PropertyRow[];

  return (
    <main className="admin-page">
      <div
        className="admin-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        <div>
          <h1>매물 관리</h1>

          <p>
            등록된 매물을 확인하고 수정하거나 삭제할 수 있습니다.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/admin/bulk"
            className="admin-back-button"
          >
            엑셀 대량등록
          </Link>

          <Link
            href="/admin/new"
            className="admin-new-button"
          >
            + 매물 등록
          </Link>
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
              <th>사진</th>
              <th>제목</th>
              <th>지역</th>
              <th>가격</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {properties.map((property) => (
              <tr key={property.id}>
                <td>{property.id}</td>

                <td>
                  {property.thumbnail_url ? (
                    <img
                      src={property.thumbnail_url}
                      alt={property.title}
                      className="admin-thumb"
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 60,
                        border: "1px solid #ddd",
                        background: "#f5f5f5",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        color: "#777",
                      }}
                    >
                      사진 없음
                    </div>
                  )}
                </td>

                <td>
                  <strong>{property.title}</strong>
                </td>

                <td>
                  {property.city}{" "}
                  {property.district}{" "}
                  {property.neighborhood}
                </td>

                <td>{property.price}</td>

                <td>{property.status}</td>

                <td>
                  <div className="admin-action-buttons">
                    <Link
                      href={`/admin/properties/${property.id}`}
                      className="admin-edit-button"
                    >
                      수정
                    </Link>

                    <DeletePropertyButton
                      id={property.id}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {properties.length === 0 && !error && (
              <tr>
                <td
                  colSpan={7}
                  className="admin-empty"
                >
                  아직 등록된 매물이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .admin-page {
          width: 100%;
          box-sizing: border-box;
        }

        .admin-header {
          margin-bottom: 24px;
        }

        .admin-header h1 {
          margin: 0;
          color: #222;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .admin-header p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
        }

        .admin-back-button,
        .admin-new-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 18px;
          border-radius: 5px;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          box-sizing: border-box;
        }

        .admin-back-button {
          border: 1px solid #ccc;
          background: #fff;
          color: #333;
        }

        .admin-new-button {
          border: 1px solid #e3a600;
          background: #f4b420;
          color: #111;
        }

        .admin-error {
          padding: 14px 16px;
          margin-bottom: 20px;
          border: 1px solid #efc7c7;
          background: #fff4f4;
          color: #c62828;
          font-size: 13px;
        }

        .admin-table-wrap {
          width: 100%;
          overflow-x: auto;
          border: 1px solid #ddd;
          background: #fff;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          table-layout: auto;
        }

        .admin-table th {
          padding: 14px 12px;
          border-bottom: 1px solid #ddd;
          background: #f7f7f7;
          color: #333;
          font-size: 13px;
          font-weight: 800;
          text-align: center;
          white-space: nowrap;
        }

        .admin-table td {
          padding: 12px;
          border-bottom: 1px solid #eee;
          color: #444;
          font-size: 13px;
          text-align: center;
          vertical-align: middle;
        }

        .admin-table tbody tr:last-child td {
          border-bottom: 0;
        }

        .admin-table tbody tr:hover {
          background: #fafafa;
        }

        .admin-thumb {
          display: block;
          width: 80px;
          height: 60px;
          margin: 0 auto;
          object-fit: cover;
          border: 1px solid #eee;
        }

        .admin-action-buttons {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .admin-edit-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 54px;
          height: 32px;
          padding: 0 12px;
          border: 1px solid #444;
          border-radius: 4px;
          background: #444;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          box-sizing: border-box;
        }

        .admin-empty {
          height: 160px;
          color: #999 !important;
          text-align: center !important;
        }
      `}</style>
    </main>
  );
}