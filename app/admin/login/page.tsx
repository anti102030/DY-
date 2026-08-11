"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!id.trim() || !password.trim()) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          id: id.trim(),
          password,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setError(result?.error ?? "로그인에 실패했습니다.");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (error) {
      console.error("관리자 로그인 오류:", error);
      setError("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dy-admin-login-page">
      <section className="dy-admin-login-box">
        <div className="dy-admin-login-logo">
          <strong>DY다이아부동산</strong>
          <span>관리자 로그인</span>
        </div>

        <form onSubmit={handleSubmit}>
          <label>
            <span>아이디</span>
            <input
              type="text"
              value={id}
              onChange={(event) => setId(event.target.value)}
              autoComplete="username"
              placeholder="관리자 아이디"
            />
          </label>

          <label>
            <span>비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              placeholder="관리자 비밀번호"
            />
          </label>

          {error ? (
            <p className="dy-admin-login-error">{error}</p>
          ) : null}

          <button type="submit" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>
      </section>

      <style>{`
        .dy-admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f5f5f5;
          box-sizing: border-box;
        }

        .dy-admin-login-box {
          width: 100%;
          max-width: 420px;
          padding: 36px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-admin-login-logo {
          margin-bottom: 28px;
          text-align: center;
        }

        .dy-admin-login-logo strong {
          display: block;
          color: #111;
          font-size: 26px;
          font-weight: 900;
        }

        .dy-admin-login-logo span {
          display: block;
          margin-top: 7px;
          color: #777;
          font-size: 13px;
          font-weight: 700;
        }

        .dy-admin-login-box form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .dy-admin-login-box label {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .dy-admin-login-box label span {
          color: #333;
          font-size: 13px;
          font-weight: 800;
        }

        .dy-admin-login-box input {
          width: 100%;
          height: 44px;
          padding: 0 12px;
          border: 1px solid #d7d7d7;
          border-radius: 4px;
          background: #fff;
          color: #222;
          font-size: 14px;
          box-sizing: border-box;
        }

        .dy-admin-login-box input:focus {
          border-color: #f4b420;
          outline: none;
        }

        .dy-admin-login-error {
          margin: 0;
          color: #d32f2f;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.5;
        }

        .dy-admin-login-box button {
          width: 100%;
          height: 46px;
          margin-top: 4px;
          border: 0;
          border-radius: 4px;
          background: #1f1f1f;
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
        }

        .dy-admin-login-box button:hover {
          background: #333;
        }

        .dy-admin-login-box button:disabled {
          opacity: 0.6;
          cursor: default;
        }
      `}</style>
    </main>
  );
}