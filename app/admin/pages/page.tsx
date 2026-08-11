import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageSetting = {
  id: number;
  page_key: string;
  page_name: string;
  title: string | null;
  description: string | null;
  is_visible: boolean;
  updated_at: string;
};

const PAGE_LINKS: Record<string, string> = {
  home: "/",
  seoul: "/?city=서울",
  gyeonggi: "/?city=경기",
  incheon: "/?city=인천",
  urgent: "/?feature=급매물",
  low_deposit: "/?deposit_max=5000",
  reviews: "/reviews",
  directions: "/consult-write",
};

async function updatePageSetting(formData: FormData) {
  "use server";

  const id = Number(formData.get("id"));
  const title = String(
    formData.get("title") ?? "",
  ).trim();

  const description = String(
    formData.get("description") ?? "",
  ).trim();

  const isVisible =
    formData.get("is_visible") === "on";

  if (!Number.isFinite(id)) {
    return;
  }

  const { error } = await supabaseAdmin
    .from("page_settings")
    .update({
      title: title || null,
      description: description || null,
      is_visible: isVisible,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(
      "페이지 설정 저장 실패:",
      error,
    );

    return;
  }

  revalidatePath("/admin/pages");
  revalidatePath("/");
  revalidatePath("/reviews");
  revalidatePath("/consult-write");
}

export default async function AdminPagesPage() {
  const { data, error } = await supabaseAdmin
    .from("page_settings")
    .select("*")
    .order("id", {
      ascending: true,
    });

  const pages = (data ?? []) as PageSetting[];

  return (
    <main className="admin-page dy-page-admin">
      <div className="admin-header">
        <div>
          <h1>페이지 관리</h1>

          <p>
            홈페이지 각 페이지의 제목, 설명,
            노출 여부를 관리합니다.
          </p>
        </div>
      </div>

      {error && (
        <p className="admin-error">
          불러오기 실패: {error.message}
        </p>
      )}

      <div className="dy-page-guide">
        여기서 변경한 내용은 저장 후 실제
        홈페이지에 적용할 수 있습니다.
      </div>

      <div className="dy-page-grid">
        {pages.map((page) => {
          const pageUrl =
            PAGE_LINKS[page.page_key] ?? "/";

          return (
            <form
              key={page.id}
              action={updatePageSetting}
              className="dy-page-card"
            >
              <input
                type="hidden"
                name="id"
                value={page.id}
              />

              <div className="dy-page-card-head">
                <div>
                  <strong>
                    {page.page_name}
                  </strong>

                  <span>
                    {page.page_key}
                  </span>
                </div>

                <a
                  href={pageUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  현재 페이지 보기
                </a>
              </div>

              <div className="dy-page-field">
                <label htmlFor={`title-${page.id}`}>
                  페이지 제목
                </label>

                <input
                  id={`title-${page.id}`}
                  type="text"
                  name="title"
                  defaultValue={
                    page.title ?? ""
                  }
                  placeholder="페이지 제목"
                />
              </div>

              <div className="dy-page-field">
                <label
                  htmlFor={`description-${page.id}`}
                >
                  페이지 설명
                </label>

                <textarea
                  id={`description-${page.id}`}
                  name="description"
                  defaultValue={
                    page.description ?? ""
                  }
                  placeholder="페이지 설명"
                />
              </div>

              <div className="dy-page-bottom">
                <label className="dy-visible-check">
                  <input
                    type="checkbox"
                    name="is_visible"
                    defaultChecked={
                      page.is_visible
                    }
                  />

                  <span>페이지 노출</span>
                </label>

                <button
                  type="submit"
                  className="dy-page-save"
                >
                  저장
                </button>
              </div>

              {page.updated_at && (
                <div className="dy-page-updated">
                  최근 수정:{" "}
                  {new Date(
                    page.updated_at,
                  ).toLocaleString("ko-KR")}
                </div>
              )}
            </form>
          );
        })}

        {pages.length === 0 && !error && (
          <div className="dy-page-empty">
            등록된 페이지 설정이 없습니다.
          </div>
        )}
      </div>

      <style>{`
        .dy-page-admin {
          width: 100%;
          color: #222;
        }

        .dy-page-admin .admin-header {
          margin-bottom: 20px;
        }

        .dy-page-admin .admin-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-page-admin .admin-header p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
        }

        .dy-page-guide {
          margin-bottom: 18px;
          padding: 13px 16px;
          border: 1px solid #e2e2e2;
          background: #f8f8f8;
          color: #666;
          font-size: 13px;
          line-height: 1.6;
        }

        .dy-page-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .dy-page-card {
          padding: 20px;
          border: 1px solid #dedede;
          border-radius: 7px;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-page-card-head {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 15px;
          margin-bottom: 17px;
          border-bottom: 1px solid #ededed;
        }

        .dy-page-card-head strong {
          display: block;
          color: #111;
          font-size: 17px;
          font-weight: 900;
        }

        .dy-page-card-head span {
          display: block;
          margin-top: 4px;
          color: #aaa;
          font-size: 11px;
        }

        .dy-page-card-head a {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 34px;
          padding: 0 11px;
          border: 1px solid #ccc;
          border-radius: 4px;
          background: #fff;
          color: #444;
          font-size: 11px;
          font-weight: 800;
          text-decoration: none;
        }

        .dy-page-card-head a:hover {
          border-color: #999;
          background: #fafafa;
        }

        .dy-page-field {
          margin-bottom: 14px;
        }

        .dy-page-field label {
          display: block;
          margin-bottom: 7px;
          color: #333;
          font-size: 12px;
          font-weight: 800;
        }

        .dy-page-field input,
        .dy-page-field textarea {
          width: 100%;
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          background: #fff;
          color: #222;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }

        .dy-page-field input {
          height: 40px;
          padding: 0 11px;
        }

        .dy-page-field textarea {
          min-height: 90px;
          padding: 10px 11px;
          line-height: 1.6;
          resize: vertical;
        }

        .dy-page-field input:focus,
        .dy-page-field textarea:focus {
          border-color: #e2a614;
        }

        .dy-page-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 5px;
        }

        .dy-visible-check {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #444;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
        }

        .dy-visible-check input {
          width: 16px;
          height: 16px;
          margin: 0;
          accent-color: #f4b420;
        }

        .dy-page-save {
          min-width: 88px;
          height: 38px;
          padding: 0 17px;
          border: 1px solid #dfa50f;
          border-radius: 4px;
          background: #f4b420;
          color: #111;
          font-family: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
        }

        .dy-page-save:hover {
          background: #e9aa12;
        }

        .dy-page-updated {
          margin-top: 13px;
          padding-top: 10px;
          border-top: 1px solid #f0f0f0;
          color: #aaa;
          font-size: 10px;
          text-align: right;
        }

        .dy-page-empty {
          grid-column: 1 / -1;
          padding: 50px 20px;
          border: 1px solid #ddd;
          background: #fff;
          color: #888;
          text-align: center;
          font-size: 13px;
        }

        @media (max-width: 1000px) {
          .dy-page-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .dy-page-card-head {
            flex-direction: column;
          }

          .dy-page-card-head a {
            align-self: flex-start;
          }
        }
      `}</style>
    </main>
  );
}