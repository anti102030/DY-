"use client";

import Link from "next/link";
import {
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

type MemberInfo = {
  id: number;
  login_id: string;
  name?: string;
};

export default function ReviewWriteForm() {
  const [authReady, setAuthReady] = useState(false);

  const [member, setMember] =
    useState<MemberInfo | null>(null);

  const [region, setRegion] = useState("");
  const [title, setTitle] = useState("");
  const [isSecret, setIsSecret] = useState(false);
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    async function loadMember() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          },
        );

        const result = await response.json();

        if (
          response.ok &&
          result.loggedIn === true
        ) {
          setMember(result.member);
        }
      } catch (error) {
        console.error(
          "회원 로그인 확인 오류:",
          error,
        );
      } finally {
        setAuthReady(true);
      }
    }

    loadMember();
  }, []);

  function insertText(
    before: string,
    after = "",
  ) {
    const textarea = textareaRef.current;

    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const selected =
      content.slice(start, end);

    const nextValue =
      content.slice(0, start) +
      before +
      selected +
      after +
      content.slice(end);

    setContent(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursor =
        start +
        before.length +
        selected.length +
        after.length;

      textarea.setSelectionRange(
        cursor,
        cursor,
      );
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!member) {
      alert(
        "로그인 후 고객후기를 작성할 수 있습니다.",
      );

      window.location.href = "/login";
      return;
    }

    if (!region) {
      alert("지역을 선택해주세요.");
      return;
    }

    if (!title.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    if (!content.trim()) {
      alert("내용을 입력해주세요.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();

      formData.append(
        "region",
        region,
      );

      formData.append(
        "title",
        title.trim(),
      );

      formData.append(
        "content",
        content.trim(),
      );

      formData.append(
        "is_secret",
        isSecret ? "true" : "false",
      );

      images.forEach((file) => {
        formData.append(
          "images",
          file,
        );
      });

      const response = await fetch(
        "/api/reviews",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        },
      );

      const result =
        await response.json();

      if (!response.ok) {
        alert(
          result.error ??
            "고객후기 등록에 실패했습니다.",
        );

        return;
      }

      alert(
        "고객후기가 등록되었습니다.",
      );

      if (result.review?.id) {
        window.location.href =
          `/reviews/${result.review.id}`;
      } else {
        window.location.href =
          "/reviews";
      }
    } catch (error) {
      console.error(
        "고객후기 등록 오류:",
        error,
      );

      alert(
        "고객후기 등록 중 오류가 발생했습니다.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (!authReady) {
    return (
      <section className="dy-review-write-page">
        <h1 className="dy-review-write-title">
          쓰기
        </h1>

        <div className="dy-review-login-message">
          로그인 상태를 확인하고 있습니다.
        </div>

        <style>{styles}</style>
      </section>
    );
  }

  if (!member) {
    return (
      <section className="dy-review-write-page">
        <h1 className="dy-review-write-title">
          쓰기
        </h1>

        <div className="dy-review-login-message">
          <strong>
            로그인 후 이용할 수 있습니다.
          </strong>

          <p>
            고객후기는 회원 로그인 후 작성
            가능합니다.
          </p>

          <Link href="/login">
            로그인
          </Link>
        </div>

        <style>{styles}</style>
      </section>
    );
  }

  return (
    <section className="dy-review-write-page">
      <h1 className="dy-review-write-title">
        쓰기
      </h1>

      <form
        className="dy-review-write-form"
        onSubmit={handleSubmit}
      >
        {/* 지역선택 */}
        <div className="dy-review-write-row">
          <div className="dy-review-write-label">
            지역선택
          </div>

          <div className="dy-review-write-field">
            <select
              className="dy-review-region-select"
              value={region}
              onChange={(event) =>
                setRegion(
                  event.target.value,
                )
              }
            >
              <option value="">
                시도
              </option>

              <option value="서울특별시">
                서울특별시
              </option>

              <option value="경기도">
                경기도
              </option>

              <option value="인천광역시">
                인천광역시
              </option>
            </select>
          </div>
        </div>

        {/* 제목 */}
        <div className="dy-review-write-row">
          <div className="dy-review-write-label">
            제목 <b>*</b>
          </div>

          <div className="dy-review-write-field dy-review-title-field">
            <input
              type="text"
              value={title}
              onChange={(event) =>
                setTitle(
                  event.target.value,
                )
              }
              maxLength={100}
            />

            <label className="dy-review-secret-check">
              <input
                type="checkbox"
                checked={isSecret}
                onChange={(event) =>
                  setIsSecret(
                    event.target.checked,
                  )
                }
              />

              <span>
                비밀글설정
              </span>
            </label>
          </div>
        </div>

        {/* 내용 */}
        <div className="dy-review-write-row dy-review-editor-row">
          <div className="dy-review-write-label">
            내용 <b>*</b>
          </div>

          <div className="dy-review-write-field dy-review-editor-field">
            <div className="dy-review-editor">
              <div className="dy-review-editor-toolbar">
                <select defaultValue="도움">
                  <option>
                    도움
                  </option>
                </select>

                <select defaultValue="9pt">
                  <option>9pt</option>
                  <option>10pt</option>
                  <option>11pt</option>
                  <option>12pt</option>
                  <option>14pt</option>
                  <option>16pt</option>
                </select>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      "**",
                      "**",
                    )
                  }
                  title="굵게"
                >
                  <b>가</b>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      "_",
                      "_",
                    )
                  }
                  title="기울임"
                >
                  <i>가</i>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText("\n")
                  }
                  title="줄바꿈"
                >
                  ↵
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText("• ")
                  }
                  title="목록"
                >
                  ≡
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      "“",
                      "”",
                    )
                  }
                  title="인용"
                >
                  “”
                </button>

                <button
                  type="button"
                  onClick={() =>
                    insertText(
                      "https://",
                    )
                  }
                  title="URL"
                >
                  URL
                </button>

                <label
                  htmlFor="review-inline-images"
                  className="dy-review-toolbar-photo"
                >
                  🖼 사진
                </label>

                <input
                  id="review-inline-images"
                  className="dy-review-hidden-file"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) =>
                    setImages(
                      Array.from(
                        event.target.files ??
                          [],
                      ).slice(0, 10),
                    )
                  }
                />
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(event) =>
                  setContent(
                    event.target.value,
                  )
                }
                aria-label="고객후기 내용"
              />

              <div className="dy-review-editor-bottom">
                <span>
                  ↕ 입력창 크기 조절
                </span>

                <div>
                  <button type="button">
                    Editor
                  </button>

                  <button type="button">
                    HTML
                  </button>

                  <button type="button">
                    TEXT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 목록사진 */}
        <div className="dy-review-write-row">
          <div className="dy-review-write-label">
            목록사진
          </div>

          <div className="dy-review-write-field dy-review-file-field">
            <label
              htmlFor="review-list-image"
              className="dy-review-file-button"
            >
              파일 선택
            </label>

            <input
              id="review-list-image"
              type="file"
              accept="image/*"
              multiple
              className="dy-review-file-input"
              onChange={(event) =>
                setImages(
                  Array.from(
                    event.target.files ??
                      [],
                  ).slice(0, 10),
                )
              }
            />

            <span className="dy-review-file-name">
              {images.length > 0
                ? images.length === 1
                  ? images[0].name
                  : `${images.length}개 파일 선택됨`
                : "선택된 파일 없음"}
            </span>
          </div>
        </div>

        {/* 등록 / 취소 */}
        <div className="dy-review-write-actions">
          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "등록 중..."
              : "등록"}
          </button>

          <Link href="/reviews">
            취소
          </Link>
        </div>
      </form>

      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .dy-review-write-page {
    width: 100%;
    background: #fff;
  }

  .dy-review-write-title {
    margin: 0 0 24px;
    padding: 0 0 22px;
    border-bottom: 2px solid #333;
    color: #111;
    font-size: 25px;
    font-weight: 900;
    letter-spacing: -1px;
  }

  .dy-review-write-form {
    width: 100%;
  }

  .dy-review-write-row {
    min-height: 62px;
    display: grid;
    grid-template-columns:
      145px minmax(0, 1fr);
    border-bottom: 1px solid #e3e3e3;
  }

  .dy-review-write-label {
    display: flex;
    align-items: center;
    padding: 0 15px;
    background: #fafafa;
    color: #444;
    font-size: 13px;
    font-weight: 600;
    box-sizing: border-box;
  }

  .dy-review-write-label b {
    margin-left: 5px;
    color: #f22;
  }

  .dy-review-write-field {
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
  }

  /* 지역선택 */

  .dy-review-region-select {
    width: 86px;
    height: 34px;
    padding: 0 9px;
    border: 1px solid #d3d3d3;
    background: #fff;
    color: #666;
    font-size: 12px;
  }

  /* 제목 */

  .dy-review-title-field {
    gap: 8px;
  }

  .dy-review-title-field
    > input[type="text"] {
    width: 428px;
    max-width: calc(100% - 130px);
    height: 34px;
    padding: 0 10px;
    border: 1px solid #d3d3d3;
    font-size: 13px;
    box-sizing: border-box;
  }

  .dy-review-secret-check {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    color: #555;
    font-size: 12px;
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
  }

  .dy-review-secret-check input {
    width: 19px;
    height: 19px;
    margin: 0;
  }

  /* 에디터 */

  .dy-review-editor-row {
    min-height: 0;
  }

  .dy-review-editor-field {
    align-items: stretch;

    /*
      아래쪽 흰 여백 제거
    */
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 0;
    padding-left: 10px;
  }

  .dy-review-editor {
    width: 100%;
    margin: 0;
    border: 1px solid #bbb;
    background: #fff;
    box-sizing: border-box;
  }

  .dy-review-editor-toolbar {
    min-height: 30px;
    display: flex;
    align-items: center;
    gap: 3px;
    padding: 2px 7px;
    border-bottom: 1px solid #bbb;
    background:
      linear-gradient(
        #f9f9f9,
        #e9e9e9
      );
    box-sizing: border-box;
  }

  .dy-review-editor-toolbar select {
    height: 22px;
    border: 1px solid #aaa;
    background: #fff;
    color: #444;
    font-size: 11px;
  }

  .dy-review-editor-toolbar
    select:first-child {
    width: 70px;
  }

  .dy-review-editor-toolbar
    select:nth-child(2) {
    width: 46px;
  }

  .dy-review-editor-toolbar button {
    min-width: 24px;
    height: 22px;
    padding: 0 5px;
    border: 1px solid #aaa;
    background: #f8f8f8;
    color: #333;
    font-size: 11px;
    cursor: pointer;
  }

  .dy-review-toolbar-photo {
    margin-left: auto;
    height: 22px;
    display: inline-flex;
    align-items: center;
    padding: 0 6px;
    border: 1px solid #aaa;
    background: #f8f8f8;
    color: #333;
    font-size: 11px;
    cursor: pointer;
  }

  .dy-review-hidden-file {
    display: none;
  }

  .dy-review-editor textarea {
    width: 100%;
    height: 400px;
    min-height: 400px;
    display: block;
    margin: 0;
    padding: 12px;
    border: 0;
    outline: 0;
    resize: vertical;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.7;
    box-sizing: border-box;
  }

  /* 에디터 하단 */

  .dy-review-editor-bottom {
    width: 100%;
    height: 20px;
    min-height: 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: 0;
    padding: 0;
    border-top: 1px solid #bbb;
    background: #f6f6f6;
    color: #777;
    font-size: 9px;
    box-sizing: border-box;
  }

  .dy-review-editor-bottom > span {
    margin-right: auto;
    margin-left: 45%;
  }

  .dy-review-editor-bottom > div {
    height: 100%;
    display: flex;
  }

  .dy-review-editor-bottom button {
    min-width: 58px;
    height: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    border-left: 1px solid #bbb;
    background: #eee;
    color: #666;
    font-size: 9px;
  }

  /* 목록사진 */

  .dy-review-file-field {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px;
    color: #555;
    font-size: 11px;
  }

  .dy-review-file-input {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    opacity: 0;
    pointer-events: none;
  }

  .dy-review-file-button {
    width: 64px;
    height: 26px;
    flex: 0 0 64px;

    display: inline-flex;
    align-items: center;
    justify-content: center;

    border: 1px solid #999;
    border-radius: 2px;

    background:
      linear-gradient(
        #ffffff,
        #eeeeee
      );

    color: #222;
    font-size: 11px;
    font-weight: 500;

    cursor: pointer;
    box-sizing: border-box;
  }

  .dy-review-file-button:hover {
    background: #f1f1f1;
  }

  .dy-review-file-name {
    color: #555;
    font-size: 11px;
  }

  /* 등록 / 취소 */

  .dy-review-write-actions {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 11px;
    padding: 30px 0 8px;
  }

  .dy-review-write-actions button,
  .dy-review-write-actions a {
    min-width: 62px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 3px;
    font-family: inherit;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    box-sizing: border-box;
  }

  .dy-review-write-actions button {
    border: 1px solid #222;

    background:
      linear-gradient(
        #555,
        #222
      );

    color: #fff;
    cursor: pointer;
  }

  .dy-review-write-actions
    button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .dy-review-write-actions a {
    border: 1px solid #ccc;

    background:
      linear-gradient(
        #fff,
        #f3f3f3
      );

    color: #666;
  }

  /* 비로그인 */

  .dy-review-login-message {
    min-height: 260px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: 8px;
    color: #777;
    font-size: 13px;
    text-align: center;
  }

  .dy-review-login-message strong {
    color: #333;
    font-size: 16px;
  }

  .dy-review-login-message p {
    margin: 0;
  }

  .dy-review-login-message a {
    min-width: 90px;
    height: 36px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #285889;
    color: #fff;
    font-size: 12px;
    font-weight: 800;
    text-decoration: none;
  }

  @media (max-width: 760px) {
    .dy-review-write-row {
      grid-template-columns:
        100px minmax(0, 1fr);
    }

    .dy-review-title-field {
      align-items: flex-start;
      flex-direction: column;
    }

    .dy-review-title-field
      > input[type="text"] {
      width: 100%;
      max-width: 100%;
    }

    .dy-review-editor-toolbar {
      flex-wrap: wrap;
    }

    .dy-review-toolbar-photo {
      margin-left: 0;
    }

    .dy-review-editor-bottom > span {
      margin-left: 10px;
    }
  }
`;