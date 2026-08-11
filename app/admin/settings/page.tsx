import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SiteSetting = {
  id: number;
  setting_key: string;
  setting_value: string | null;
  updated_at: string;
};

const SETTING_FIELDS = [
  {
    key: "company_name",
    label: "회사명",
    placeholder: "DY다이아부동산",
  },
  {
    key: "phone",
    label: "대표 전화번호",
    placeholder: "010-8426-8616",
  },
  {
    key: "consult_hours",
    label: "상담 가능시간",
    placeholder: "365일 24시간 상담가능!",
  },
  {
    key: "address",
    label: "회사 주소",
    placeholder: "회사 주소를 입력하세요.",
  },
  {
    key: "email",
    label: "이메일",
    placeholder: "이메일 주소를 입력하세요.",
  },
  {
    key: "header_consult_title",
    label: "상단 상담 제목",
    placeholder: "고객상담전화",
  },
  {
    key: "header_consult_text",
    label: "상단 맞춤상담 문구",
    placeholder: "내집마련 맞춤컨설팅!",
  },
  {
    key: "footer_text",
    label: "하단 기본 문구",
    placeholder: "DY다이아부동산",
  },
];

async function saveSiteSettings(formData: FormData) {
  "use server";

  for (const field of SETTING_FIELDS) {
    const value = String(
      formData.get(field.key) ?? "",
    ).trim();

    const { error } = await supabaseAdmin
      .from("site_settings")
      .upsert(
        {
          setting_key: field.key,
          setting_value: value,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "setting_key",
        },
      );

    if (error) {
      console.error(
        `[사이트 설정] ${field.key} 저장 실패:`,
        error,
      );

      throw new Error(
        `${field.label} 저장에 실패했습니다.`,
      );
    }
  }

  revalidatePath("/");
  revalidatePath("/admin/settings");
}

export default async function AdminSettingsPage() {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .select("*");

  const rows = (data ?? []) as SiteSetting[];

  const settings = Object.fromEntries(
    rows.map((item) => [
      item.setting_key,
      item.setting_value ?? "",
    ]),
  );

  return (
    <main className="admin-page dy-settings-page">
      <div className="admin-header">
        <div>
          <h1>사이트 기본설정</h1>

          <p>
            사이트에서 공통으로 사용하는 회사정보와
            상담정보를 관리합니다.
          </p>
        </div>
      </div>

      {error && (
        <div className="dy-settings-error">
          설정을 불러오지 못했습니다:
          {" "}
          {error.message}
        </div>
      )}

      <form
        action={saveSiteSettings}
        className="dy-settings-form"
      >
        <section className="dy-settings-card">
          <div className="dy-settings-card-head">
            <div>
              <h2>회사 기본정보</h2>

              <p>
                홈페이지에서 공통으로 사용할
                기본 정보를 입력하세요.
              </p>
            </div>
          </div>

          <div className="dy-settings-grid">
            {SETTING_FIELDS.map((field) => (
              <div
                className="dy-settings-field"
                key={field.key}
              >
                <label htmlFor={field.key}>
                  {field.label}
                </label>

                <input
                  id={field.key}
                  name={field.key}
                  type={
                    field.key === "email"
                      ? "email"
                      : "text"
                  }
                  defaultValue={
                    settings[field.key] ?? ""
                  }
                  placeholder={field.placeholder}
                />
              </div>
            ))}
          </div>
        </section>

        <div className="dy-settings-save-wrap">
          <div>
            <strong>
              사이트 기본설정 저장
            </strong>

            <p>
              저장한 정보는 연결된 홈페이지 영역에
              사용됩니다.
            </p>
          </div>

          <button
            type="submit"
            className="dy-settings-save-button"
          >
            설정 저장
          </button>
        </div>
      </form>

      <style>{`
        .dy-settings-page {
          width: 100%;
          color: #222;
        }

        .dy-settings-page .admin-header {
          margin-bottom: 22px;
        }

        .dy-settings-page .admin-header h1 {
          margin: 0;
          color: #111;
          font-size: 28px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-settings-page .admin-header p {
          margin: 8px 0 0;
          color: #777;
          font-size: 14px;
          line-height: 1.6;
        }

        .dy-settings-error {
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid #e2b4b4;
          background: #fff5f5;
          color: #b22222;
          font-size: 13px;
        }

        .dy-settings-form {
          width: 100%;
        }

        .dy-settings-card {
          padding: 24px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-settings-card-head {
          padding-bottom: 18px;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
        }

        .dy-settings-card-head h2 {
          margin: 0;
          color: #111;
          font-size: 19px;
          font-weight: 900;
        }

        .dy-settings-card-head p {
          margin: 7px 0 0;
          color: #888;
          font-size: 12px;
        }

        .dy-settings-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 18px 20px;
        }

        .dy-settings-field label {
          display: block;
          margin-bottom: 7px;
          color: #333;
          font-size: 12px;
          font-weight: 800;
        }

        .dy-settings-field input {
          width: 100%;
          height: 42px;
          padding: 0 12px;
          border: 1px solid #d4d4d4;
          border-radius: 4px;
          background: #fff;
          color: #222;
          font-family: inherit;
          font-size: 13px;
          outline: none;
          box-sizing: border-box;
        }

        .dy-settings-field input:focus {
          border-color: #e1a512;
          box-shadow:
            0 0 0 2px
            rgba(244, 180, 32, 0.1);
        }

        .dy-settings-save-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;

          margin-top: 18px;
          padding: 20px 22px;

          border: 1px solid #ddd;
          border-radius: 8px;

          background: #fff;
        }

        .dy-settings-save-wrap strong {
          display: block;
          color: #111;
          font-size: 14px;
          font-weight: 900;
        }

        .dy-settings-save-wrap p {
          margin: 5px 0 0;
          color: #888;
          font-size: 11px;
        }

        .dy-settings-save-button {
          min-width: 110px;
          height: 42px;
          padding: 0 20px;

          border: 1px solid #dda20c;
          border-radius: 5px;

          background: #f4b420;
          color: #111;

          font-family: inherit;
          font-size: 13px;
          font-weight: 900;

          cursor: pointer;
        }

        .dy-settings-save-button:hover {
          background: #e9aa12;
        }

        @media (max-width: 850px) {
          .dy-settings-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .dy-settings-save-wrap {
            align-items: stretch;
            flex-direction: column;
          }

          .dy-settings-save-button {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}