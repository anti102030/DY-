"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type {
  ConsultationNotice,
  InquiryRow,
} from "@/app/inquiry/page";

type Props = {
  initialInquiries: InquiryRow[];
  recentConsultations: ConsultationNotice[];
  loadError?: string;
};

function formatDate(value: string) {
  const date = new Date(value);

  return `${String(date.getFullYear()).slice(2)}.${String(
    date.getMonth() + 1
  ).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
}

function maskName(name: string) {
  const value = name.trim();

  if (value.length <= 1) return value;
  if (value.length === 2) return `${value[0]}*`;

  return `${value[0]}${"*".repeat(value.length - 2)}${
    value[value.length - 1]
  }`;
}

function createCaptcha() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export default function InquiryBoardClient({
  initialInquiries,
  recentConsultations,
  loadError = "",
}: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [content, setContent] = useState("");
  const [inquiryType, setInquiryType] = useState<"신축분양" | "매매">(
    "신축분양"
  );
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [searchField, setSearchField] = useState<
    "통합검색" | "제목" | "등록자" | "내용"
  >("통합검색");
  const [page, setPage] = useState(1);
  const [recentStartIndex, setRecentStartIndex] = useState(0);
  const [recentMoving, setRecentMoving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [pageSize, setPageSize] = useState<number | "">("");

  useEffect(() => {
    setMounted(true);
    setCaptchaCode(createCaptcha());
  }, []);

  useEffect(() => {
    if (recentConsultations.length === 0) return;

    let resetTimer: number | undefined;
    let moveTimer: number | undefined;

    const startTimer = window.setTimeout(() => {
      moveTimer = window.setInterval(() => {
        setRecentMoving(true);

        resetTimer = window.setTimeout(() => {
          setRecentStartIndex(
            (current) =>
              (current + 1) % recentConsultations.length
          );
          setRecentMoving(false);
        }, 650);
      }, 4500);
    }, 4500);

    return () => {
      window.clearTimeout(startTimer);
      if (moveTimer) window.clearInterval(moveTimer);
      if (resetTimer) window.clearTimeout(resetTimer);
    };
  }, [recentConsultations.length]);

  const tickerItems = useMemo(() => {
    if (recentConsultations.length === 0) return [];

    // 화면에 보이는 6줄 + 아래에서 올라올 다음 1줄
    return Array.from({ length: 7 }, (_, index) =>
      recentConsultations[
        (recentStartIndex + index) %
          recentConsultations.length
      ]
    );
  }, [recentConsultations, recentStartIndex]);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    if (!q) return initialInquiries;

    return initialInquiries.filter((item) => {
      if (searchField === "등록자") {
        return item.name.toLowerCase().includes(q);
      }

      if (searchField === "내용") {
        return item.content.toLowerCase().includes(q);
      }

      if (searchField === "제목") {
        return item.title.toLowerCase().includes(q);
      }

      return `${item.title} ${item.name} ${item.content}`
        .toLowerCase()
        .includes(q);
    });
  }, [initialInquiries, keyword, searchField]);

  const effectivePageSize = pageSize || 10;

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / effectivePageSize)
  );

  const pageBlockStart = Math.floor((page - 1) / 10) * 10 + 1;
  const pageBlockEnd = Math.min(pageBlockStart + 9, totalPages);
  const visiblePageNumbers = Array.from(
    { length: pageBlockEnd - pageBlockStart + 1 },
    (_, index) => pageBlockStart + index
  );


  const visibleItems = filtered.slice(
    (page - 1) * effectivePageSize,
    page * effectivePageSize
  );

  function refreshCaptcha() {
    setCaptchaCode(createCaptcha());
    setCaptchaInput("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) return alert("이름을 입력해주세요.");
    if (!phone.trim()) return alert("연락처를 입력해주세요.");
    if (!content.trim())
      return alert("상담내용을 입력해주세요.");

    if (captchaInput !== captchaCode) {
      alert("스팸방지코드가 일치하지 않습니다.");
      refreshCaptcha();
      return;
    }

    if (!privacyAgreed) {
      return alert("개인정보처리방침에 동의해주세요.");
    }

    setSubmitting(true);

    const { error: inquiryError } = await supabase
      .from("inquiries")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: null,
        title: `${inquiryType} 상담이 접수되었습니다.`,
        content: content.trim(),
        is_secret: true,
        status: inquiryType,
      });

    if (inquiryError) {
      setSubmitting(false);

      return alert(
        `문의 등록에 실패했습니다.\n${inquiryError.message}`
      );
    }

    const { error: consultationError } = await supabase
      .from("consultations")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        region: "문의게시판",
        message: `[${inquiryType}] 문의게시판 빠른상담\n\n${content.trim()}`,
        status: "신규",
        source: "문의게시판 빠른상담",
      });

    setSubmitting(false);

    if (consultationError) {
      return alert(
        `문의게시판에는 등록되었지만 관리자 문의 관리 등록에 실패했습니다.\n${consultationError.message}`
      );
    }

    alert("상담신청이 정상적으로 접수되었습니다.");
    setName("");
    setPhone("");
    setContent("");
    setInquiryType("신축분양");
    setPrivacyAgreed(false);
    refreshCaptcha();
    router.refresh();
  }

  if (!mounted) {
    return (
      <section
        className="kn-inquiry-page"
        style={{
          minHeight: "900px",
          background: "#fff",
          visibility: "hidden",
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <section className="kn-inquiry-page">
      <h1 className="kn-inquiry-title">문의게시판</h1>

      <div className="kn-inquiry-divider" />

      <div className="kn-inquiry-intro">
        <div>
          DY다이아부동산은{" "}
          <strong>신축분양 · 매매전문 무사고인증</strong> 회사입니다.
        </div>
        <p>365일 24시간 상담 가능합니다. 편하게 문의 남겨주세요.</p>
      </div>

      <div className="kn-inquiry-top-box">
        <form
          className="kn-fast-form"
          onSubmit={handleSubmit}
        >
          <h2>빠른 상담 신청</h2>

          <div className="kn-fast-row">
            <label>이&nbsp;&nbsp;&nbsp;&nbsp;름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="kn-fast-row">
            <label>연락처</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="확인 알림용으로만 사용됩니다."
            />
          </div>

          <div className="kn-fast-row">
            <label>문의분류</label>
            <select
              value={inquiryType}
              onChange={(e) =>
                setInquiryType(e.target.value as "신축분양" | "매매")
              }
            >
              <option value="신축분양">신축분양</option>
              <option value="매매">매매</option>
            </select>
          </div>

          <div className="kn-fast-row kn-fast-row-textarea">
            <label>상담내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="상담내용"
            />
          </div>

          <div className="kn-captcha-line">
            <button
              type="button"
              className="kn-captcha-image"
              onClick={refreshCaptcha}
            >
              {captchaCode || "------"}
            </button>

            <input
              value={captchaInput}
              onChange={(e) =>
                setCaptchaInput(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                )
              }
              placeholder="스팸방지코드 입력"
              inputMode="numeric"
            />

            <label className="kn-privacy-check">
              <input
                type="checkbox"
                checked={privacyAgreed}
                onChange={(e) =>
                  setPrivacyAgreed(e.target.checked)
                }
              />
              개인정보처리방침 <u>보기</u>
            </label>
          </div>

          <button
            className="kn-submit-button"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "접수 중..." : "상담신청"}
          </button>
        </form>

        <aside className="kn-recent-inquiries">
          <h2>문의게시판</h2>

          <div className="kn-recent-list-window">
            <div
              className={`kn-recent-list-track ${
                recentMoving ? "is-moving" : ""
              }`}
            >
              {tickerItems.length > 0
                ? tickerItems.map((item, index) => (
                    <div
                      className="kn-recent-item"
                      key={`${recentStartIndex}-${item.id}-${index}`}
                    >
                      <strong>
                        🔒 신축분양 · 매매 상담이 접수되었습니다.
                      </strong>
                    </div>
                  ))
                : Array.from({ length: 7 }).map(
                    (_, index) => (
                      <div
                        className="kn-recent-item"
                        key={`empty-${index}`}
                      >
                        <strong>
                          🔒 신축분양 · 매매 상담이 접수되었습니다.
                        </strong>
                      </div>
                    )
                  )}
            </div>
          </div>
        </aside>
      </div>

      <div className="kn-board-wrap">
        {loadError && (
          <p className="kn-load-error">
            게시글을 불러오지 못했습니다: {loadError}
          </p>
        )}

        <table className="kn-board-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>매매가격</th>
              <th>등록자</th>
              <th>등록일</th>
              <th>분류</th>
            </tr>
          </thead>

          <tbody>
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td className="kn-board-subject">
                    <span>🔒</span>{" "}
                    {item.title ||
                      "🔒 신축분양 · 매매 상담이 접수되었습니다."}
                  </td>
                  <td>-</td>
                  <td>{maskName(item.name)}</td>
                  <td>{formatDate(item.created_at)}</td>
                  <td><span className="kn-inquiry-status">문의접수</span></td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="kn-board-empty"
                >
                  등록된 문의가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="kn-board-bottom">
          <div className="kn-board-actions">
            <button
              type="button"
              className="kn-write-button"
              onClick={() => router.push("/inquiry/write")}
            >
              글쓰기
            </button>
          </div>

          <div className="kn-pagination">
            <button
              type="button"
              aria-label="이전 10페이지"
              disabled={pageBlockStart === 1}
              onClick={() =>
                setPage(Math.max(1, pageBlockStart - 10))
              }
            >
              &lt;&lt;
            </button>

            <button
              type="button"
              aria-label="이전 페이지"
              disabled={page === 1}
              onClick={() =>
                setPage((current) => Math.max(1, current - 1))
              }
            >
              &lt;
            </button>

            {visiblePageNumbers.map((number) => (
              <button
                type="button"
                key={number}
                className={number === page ? "active" : ""}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}

            <button
              type="button"
              aria-label="다음 페이지"
              disabled={page === totalPages}
              onClick={() =>
                setPage((current) => Math.min(totalPages, current + 1))
              }
            >
              &gt;
            </button>

            <button
              type="button"
              aria-label="다음 10페이지"
              disabled={pageBlockEnd >= totalPages}
              onClick={() =>
                setPage(Math.min(totalPages, pageBlockStart + 10))
              }
            >
              &gt;&gt;
            </button>
          </div>

          <div className="kn-board-search">
            <span className="kn-board-search-label">검색</span>

            <select
              value={searchField}
              onChange={(e) => {
                setSearchField(
                  e.target.value as
                    | "통합검색"
                    | "제목"
                    | "등록자"
                    | "내용"
                );
                setPage(1);
              }}
            >
              <option value="통합검색">통합검색</option>
              <option value="제목">제목</option>
              <option value="등록자">등록자</option>
              <option value="내용">내용</option>
            </select>

            <input
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setPage(1);
              }}
              placeholder="검색어 입력"
            />

            <select
              value={pageSize}
              onChange={(e) => {
                const value = e.target.value;
                setPageSize(value ? Number(value) : "");
                setPage(1);
              }}
              aria-label="목록 수"
            >
              <option value="">목록수</option>
              {[
                10, 20, 30, 40, 50, 60, 70, 80,
                100, 200, 300, 500, 1000,
              ].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button type="button">검색하기</button>
          </div>
        </div>
      </div>

      <style>{`
        .kn-fast-row > select {
          width: 100%;
          height: 36px;
          padding: 0 34px 0 10px;
          border: 1px solid #d7d7d7;
          border-radius: 0;
          background-color: #fff;
          color: #555;
          font-size: 12px;
          box-sizing: border-box;
        }

        .kn-inquiry-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 58px;
          height: 28px;
          padding: 0 9px;
          border: 1px solid #d9d9d9;
          background: #fff;
          color: #555;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          box-sizing: border-box;
        }

        .kn-board-bottom {
          display: block !important;
          width: 100% !important;
          min-height: 170px !important;
          margin-top: 14px !important;
          padding: 0 !important;
          position: relative !important;
          box-sizing: border-box !important;
        }

        .kn-board-actions {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-end !important;
          width: 100% !important;
          margin: 0 0 24px !important;
        }

        .kn-board-actions button {
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 34px !important;
          padding: 0 14px !important;
          border: 1px solid #d7d7d7 !important;
          background: #fff !important;
          color: #666 !important;
          font-size: 12px !important;
          font-weight: 700 !important;
          line-height: 1 !important;
        }


        .kn-pagination {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          margin: 0 0 14px !important;
          gap: 0 !important;
          float: none !important;
          position: static !important;
        }

        .kn-pagination button {
          min-width: 34px !important;
          height: 32px !important;
          padding: 0 8px !important;
          border: 1px solid #dedede !important;
          border-right: 0 !important;
          background: #fff !important;
          color: #555 !important;
          font-size: 12px !important;
          line-height: 30px !important;
          text-align: center !important;
          font-weight: 400 !important;
        }

        .kn-pagination button:last-child {
          border-right: 1px solid #ddd;
        }

        .kn-pagination button.active {
          border-color: #d8d8d8 !important;
          background: #fff !important;
          color: #00a7d8 !important;
          font-weight: 700 !important;
        }

        .kn-pagination button:disabled {
          color: #aaa !important;
          background: #f7f7f7 !important;
          cursor: default !important;
        }

        .kn-board-search {
          display: flex !important;
          align-items: center !important;
          justify-content: flex-start !important;
          width: 100% !important;
          gap: 6px !important;
          margin: 0 !important;
          padding: 16px 28px !important;
          border: 1px solid #dedede !important;
          background: #fff !important;
          float: none !important;
          position: static !important;
          box-sizing: border-box !important;
        }

        .kn-board-search-label {
          width: 54px !important;
          color: #444 !important;
          font-size: 13px !important;
          font-weight: 400 !important;
          white-space: nowrap !important;
        }

        .kn-board-search select {
          width: 112px !important;
          height: 34px !important;
          padding: 0 8px !important;
          border: 1px solid #d5d5d5 !important;
          background: #fff !important;
          color: #666 !important;
          font-size: 12px !important;
          box-sizing: border-box !important;
        }

        .kn-board-search select:nth-of-type(2) {
          width: 92px !important;
        }

        .kn-board-search input {
          width: 220px !important;
          height: 34px !important;
          padding: 0 9px !important;
          border: 1px solid #d5d5d5 !important;
          background: #fff !important;
          color: #555 !important;
          font-size: 12px !important;
          box-sizing: border-box !important;
        }

        .kn-board-search button {
          width: 82px !important;
          height: 34px !important;
          padding: 0 !important;
          border: 1px solid #4b4b4b !important;
          background: #4b4b4b !important;
          color: #fff !important;
          font-size: 12px !important;
          font-weight: 700 !important;
        }

        @media (max-width: 640px) {
          .kn-board-search {
            flex-wrap: wrap;
          }

          .kn-board-search input {
            width: min(230px, 100%);
          }
        }
      `}</style>
    </section>
  );
}
