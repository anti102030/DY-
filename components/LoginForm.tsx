"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import SignupBreadcrumb from "@/components/SignupBreadcrumb";

export default function LoginForm() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [saveId, setSaveId] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedId = window.localStorage.getItem("dy_saved_login_id");

    if (savedId) {
      setUserId(savedId);
      setSaveId(true);
    }
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const cleanId = userId.trim();

    if (!cleanId) {
      alert("아이디를 입력해주세요.");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          login_id: cleanId,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        alert(
          result.error ??
            "아이디 또는 비밀번호를 확인해주세요.",
        );
        return;
      }

      if (saveId) {
        window.localStorage.setItem(
          "dy_saved_login_id",
          cleanId,
        );
      } else {
        window.localStorage.removeItem(
          "dy_saved_login_id",
        );
      }

      window.location.href = "/";
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("로그인 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="dy-login-page">
      <div className="dy-login-top">
        <h1>로그인</h1>

        <SignupBreadcrumb current="로그인" />
      </div>

      <div className="dy-login-content">
        <h2>LOGIN</h2>

        <form
          className="dy-login-box"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            value={userId}
            onChange={(event) =>
              setUserId(event.target.value)
            }
            placeholder="아이디"
            autoComplete="username"
          />

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            placeholder="비밀번호"
            autoComplete="current-password"
          />

          <div className="dy-login-options">
            <div>
              <label>
                <input
                  type="checkbox"
                  checked={saveId}
                  onChange={(event) =>
                    setSaveId(event.target.checked)
                  }
                />
                아이디 저장
              </label>
            </div>

            <span className="dy-login-help">
              도움말 <b>?</b>
            </span>
          </div>

          <button
            type="submit"
            className="dy-login-submit"
            disabled={loading}
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="dy-login-bottom-buttons">
          <Link href="/signup">회원가입</Link>

          <button
            type="button"
            onClick={() =>
              alert(
                "아이디/비밀번호 찾기 기능은 추후 연결하면 됩니다.",
              )
            }
          >
            아이디/비밀번호 찾기
          </button>
        </div>
      </div>

      <style>{`
        .dy-login-page {
          width: 100%;
          min-height: 560px;
          background: #fff;
        }

        .dy-login-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .dy-login-top h1 {
          margin: 0;
          color: #111;
          font-size: 26px;
          font-weight: 900;
          letter-spacing: -1px;
        }

        .dy-login-content {
          width: 450px;
          max-width: 100%;
          margin: 70px auto 0;
        }

        .dy-login-content h2 {
          margin: 0 0 28px;
          color: #333;
          font-size: 42px;
          font-weight: 700;
          text-align: center;
        }

        .dy-login-box {
          padding: 26px;
          border: 1px solid #ddd;
          background: #fafafa;
          box-sizing: border-box;
        }

        .dy-login-box > input {
          width: 100%;
          height: 46px;
          margin-bottom: 10px;
          padding: 0 12px;
          border: 1px solid #d5d5d5;
          background: #fff;
          color: #333;
          font-size: 14px;
          box-sizing: border-box;
        }

        .dy-login-box > input::placeholder {
          color: #aaa;
          font-weight: 700;
        }

        .dy-login-options {
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          color: #666;
          font-size: 12px;
        }

        .dy-login-options > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dy-login-options label {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          cursor: pointer;
        }

        .dy-login-options input {
          width: 18px;
          height: 18px;
          margin: 0;
        }

        .dy-login-help {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          white-space: nowrap;
        }

        .dy-login-help b {
          width: 15px;
          height: 15px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d7c69a;
          color: #9a7b25;
          font-size: 10px;
          box-sizing: border-box;
        }

        .dy-login-submit {
          width: 100%;
          height: 50px;
          border: 0;
          background: linear-gradient(#2d6093, #174675);
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          cursor: pointer;
        }

        .dy-login-submit:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .dy-login-bottom-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
          width: 380px;
          max-width: 100%;
          margin: 30px auto 0;
        }

        .dy-login-bottom-buttons a,
        .dy-login-bottom-buttons button {
          min-height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 24px;
          background: #f0f3f5;
          color: #44668a;
          font-family: inherit;
          font-size: 13px;
          font-weight: 800;
          text-decoration: none;
          cursor: pointer;
        }

        @media (max-width: 650px) {
          .dy-login-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .dy-login-content {
            margin-top: 45px;
          }

          .dy-login-content h2 {
            font-size: 34px;
          }

          .dy-login-bottom-buttons {
            grid-template-columns: 1fr;
            gap: 10px;
          }
        }
      `}</style>
    </section>
  );
}
