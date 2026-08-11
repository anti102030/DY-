"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import SignupBreadcrumb from "@/components/SignupBreadcrumb";

export default function MemberEditForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interestRegion, setInterestRegion] = useState("");
  const [marketingAgree, setMarketingAgree] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setName(String(user.user_metadata?.name ?? ""));
      setPhone(String(user.user_metadata?.phone ?? ""));
      setInterestRegion(String(user.user_metadata?.interest_region ?? ""));
      setMarketingAgree(user.user_metadata?.marketing_agree !== false);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);

    const attributes: {
      data: {
        name: string;
        phone: string;
        interest_region: string;
        marketing_agree: boolean;
      };
      password?: string;
    } = {
      data: {
        name: name.trim(),
        phone: phone.replace(/\D/g, ""),
        interest_region: interestRegion.trim(),
        marketing_agree: marketingAgree,
      },
    };

    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setSaving(false);
        alert("새 비밀번호는 6자 이상 입력해주세요.");
        return;
      }

      attributes.password = newPassword;
    }

    const { error } = await supabase.auth.updateUser(attributes);
    setSaving(false);

    if (error) {
      alert(`정보수정에 실패했습니다.\n${error.message}`);
      return;
    }

    alert("회원정보가 수정되었습니다.");
    setNewPassword("");
  }

  if (loading) {
    return <p>회원정보를 불러오는 중입니다...</p>;
  }

  return (
    <section className="dy-member-edit-page">
      <div className="dy-member-edit-heading">
        <h1>정보수정</h1>
        <SignupBreadcrumb current="정보수정" />
      </div>

      <form className="dy-member-edit-form" onSubmit={handleSubmit}>
        <div className="dy-member-edit-row">
          <label>이름</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="dy-member-edit-row">
          <label>휴대전화</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
          />
        </div>

        <div className="dy-member-edit-row">
          <label>관심지역</label>
          <input
            value={interestRegion}
            onChange={(e) => setInterestRegion(e.target.value)}
          />
        </div>

        <div className="dy-member-edit-row">
          <label>문자수신</label>

          <div className="dy-member-radio">
            <label>
              <input
                type="radio"
                checked={marketingAgree}
                onChange={() => setMarketingAgree(true)}
              />
              예
            </label>

            <label>
              <input
                type="radio"
                checked={!marketingAgree}
                onChange={() => setMarketingAgree(false)}
              />
              아니오
            </label>
          </div>
        </div>

        <div className="dy-member-edit-row">
          <label>새 비밀번호</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="변경할 때만 입력"
          />
        </div>

        <button
          type="submit"
          className="dy-member-edit-submit"
          disabled={saving}
        >
          {saving ? "저장 중..." : "정보수정"}
        </button>
      </form>

      <style>{`
        .dy-member-edit-page { width:100%; background:#fff; }
        .dy-member-edit-heading {
          display:flex; align-items:center; justify-content:space-between;
          gap:20px; margin-bottom:20px;
        }
        .dy-member-edit-heading h1 {
          margin:0; font-size:26px; font-weight:900;
        }
        .dy-member-edit-form { border-top:2px solid #333; }
        .dy-member-edit-row {
          display:grid; grid-template-columns:145px minmax(0,1fr);
          min-height:64px; border-bottom:1px solid #e2e2e2;
        }
        .dy-member-edit-row > label {
          display:flex; align-items:center; padding:0 15px;
          background:#f7f7f7; font-size:13px; font-weight:800;
        }
        .dy-member-edit-row > input {
          width:320px; max-width:calc(100% - 24px); height:36px;
          margin:auto 12px; padding:0 10px; border:1px solid #ccc;
          box-sizing:border-box;
        }
        .dy-member-radio {
          display:flex; align-items:center; gap:12px; padding:0 12px;
        }
        .dy-member-radio label {
          display:inline-flex; align-items:center; gap:4px; font-size:13px;
        }
        .dy-member-edit-submit {
          display:block; width:160px; height:48px; margin:30px auto 0;
          border:0; background:#285889; color:#fff; font-size:15px;
          font-weight:900; cursor:pointer;
        }
      `}</style>
    </section>
  );
}
