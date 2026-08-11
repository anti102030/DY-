"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AdminLoginForm() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!loginId.trim()) {
      alert("관리자 아이디를 입력해주세요.");
      return;
    }

    if (!password) {
      alert("관리자 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/admin-auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            login_id: loginId.trim(),
            password,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ??
            "관리자 로그인에 실패했습니다.",
        );
        return;
      }

      window.location.href = "/admin";
    } catch (error) {
      console.error(
        "관리자 로그인 오류:",
        error,
      );

      alert(
        "관리자 로그인 중 오류가 발생했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="dy-admin-login-page">
      <section className="dy-admin-login-card">
        <Link
          href="/"
          className="dy-admin-login-logo"
        >
          <img
            src="/dy-logo-transparent.png"
            alt="DY다이아부동산"
          />
        </Link>

        <h1>관리자 로그인</h1>
        <p>
          관리자 계정으로 로그인해주세요.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={loginId}
            onChange={(event) =>
              setLoginId(event.target.value)
            }
            placeholder="관리자 아이디"
            autoComplete="username"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="관리자 비밀번호"
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "로그인 중..."
              : "관리자 로그인"}
          </button>
        </form>

        <Link
          href="/"
          className="dy-admin-home"
        >
          사이트로 돌아가기
        </Link>
      </section>

      <style>{`
        .dy-admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: #f4f4f4;
          box-sizing: border-box;
        }

        .dy-admin-login-card {
          width: 410px;
          max-width: 100%;
          padding: 38px 34px;
          border: 1px solid #ddd;
          background: #fff;
          box-shadow:
            0 8px 28px rgba(0,0,0,.08);
          box-sizing: border-box;
        }

        .dy-admin-login-logo {
          width: 190px;
          display: block;
          margin: 0 auto 22px;
        }

        .dy-admin-login-logo img {
          width: 100%;
          max-height: 72px;
          display: block;
          object-fit: contain;
        }

        .dy-admin-login-card h1 {
          margin: 0;
          color: #111;
          font-size: 25px;
          font-weight: 900;
          text-align: center;
        }

        .dy-admin-login-card > p {
          margin: 8px 0 25px;
          color: #888;
          font-size: 12px;
          text-align: center;
        }

        .dy-admin-login-card form {
          display: grid;
          gap: 10px;
        }

        .dy-admin-login-card input {
          width: 100%;
          height: 46px;
          padding: 0 12px;
          border: 1px solid #ccc;
          font-size: 14px;
          box-sizing: border-box;
        }

        .dy-admin-login-card button {
          width: 100%;
          height: 48px;
          margin-top: 4px;
          border: 0;
          background: #222;
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
        }

        .dy-admin-login-card button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .dy-admin-home {
          display: block;
          margin-top: 18px;
          color: #777;
          font-size: 12px;
          text-align: center;
          text-decoration: none;
        }
      `}</style>
    </main>
  );
}
