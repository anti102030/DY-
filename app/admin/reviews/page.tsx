import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/reviewTypes";
import DeleteReviewButton from "@/components/DeleteReviewButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminReviewsPage() {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .order("id", { ascending: false });

  const reviews = (data ?? []) as ReviewRow[];

  return (
    <main className="admin-page">
      <div
        className="admin-header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>고객후기 관리</h1>

          <p>
            고객후기를 등록하고 수정하거나 삭제할 수 있습니다.
          </p>
        </div>

        {/* 후기 등록만 표시 */}
        <Link
          href="/admin/reviews/new"
          className="admin-new-button"
        >
          + 후기 등록
        </Link>
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
              <th>작성자</th>
              <th>상태</th>
              <th>베스트</th>
              <th>관리</th>
            </tr>
          </thead>

          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>

                <td>
                  {review.thumbnail_url ? (
                    <img
                      src={review.thumbnail_url}
                      alt={review.title}
                      className="admin-thumb"
                    />
                  ) : (
                    <div
                      style={{
                        width: 80,
                        height: 60,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        border: "1px solid #ddd",
                        background: "#f5f5f5",
                        color: "#888",
                        fontSize: 11,
                      }}
                    >
                      사진 없음
                    </div>
                  )}
                </td>

                <td>
                  <Link href={`/reviews/${review.id}`}>
                    {review.title}
                  </Link>
                </td>

                <td>
                  {review.author || "DY다이아부동산"}
                </td>

                <td>{review.status}</td>

                <td>
                  {review.is_best ? (
                    <strong
                      style={{
                        color: "#e3a400",
                        fontWeight: 900,
                      }}
                    >
                      BEST
                    </strong>
                  ) : (
                    "-"
                  )}
                </td>

                <td>
                  <div className="admin-action-buttons">
                    <Link
                      href={`/admin/reviews/${review.id}`}
                      className="admin-edit-button"
                    >
                      수정
                    </Link>

                    <DeleteReviewButton
                      id={review.id}
                    />
                  </div>
                </td>
              </tr>
            ))}

            {reviews.length === 0 && !error && (
              <tr>
                <td
                  colSpan={7}
                  className="admin-empty"
                >
                  아직 등록된 고객후기가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
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

        .admin-new-button {
          min-width: 108px;
          height: 42px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          padding: 0 18px;

          border: 1px solid #e3a600;
          border-radius: 5px;

          background: #f4b420;
          color: #111;

          font-size: 13px;
          font-weight: 900;

          text-decoration: none;
          box-sizing: border-box;
        }

        .admin-new-button:hover {
          background: #e9aa12;
        }
      `}</style>
    </main>
  );
}