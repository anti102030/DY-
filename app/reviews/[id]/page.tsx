import Link from "next/link";
import { notFound } from "next/navigation";

import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/reviewTypes";

import InnerPageTop from "@/components/InnerPageTop";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const RELATED_PAGE_SIZE = 8;
const PAGE_BLOCK_SIZE = 10;

export default async function ReviewDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;

  searchParams: Promise<{
    relatedPage?: string;
  }>;
}) {
  const { id } = await params;

  const resolvedSearchParams =
    await searchParams;

  const reviewId = Number(id);

  if (
    !Number.isInteger(reviewId) ||
    reviewId <= 0
  ) {
    notFound();
  }

  const requestedRelatedPage =
    Number(
      resolvedSearchParams.relatedPage ??
        "1",
    );

  /*
    현재 후기
  */
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("id", reviewId)
    .eq("status", "공개")
    .single();

  if (error || !data) {
    notFound();
  }

  const review = data as ReviewRow;

  /*
    썸네일 + 상세 사진
    중복 제거
  */
  const images = Array.from(
    new Set(
      [
        review.thumbnail_url,

        ...(review.image_urls ?? []),
      ].filter(
        (value): value is string =>
          Boolean(value),
      ),
    ),
  );

  /*
    하단 고객후기 목록
  */
  const {
    data: relatedData,
    count: relatedCount,
  } = await supabase
    .from("reviews")
    .select("*", {
      count: "exact",
    })
    .eq("status", "공개")
    .neq("id", reviewId)
    .order("id", {
      ascending: false,
    });

  const allRelatedReviews =
    (relatedData ?? []) as ReviewRow[];

  const totalRelatedCount =
    relatedCount ??
    allRelatedReviews.length;

  const totalRelatedPages =
    Math.max(
      1,
      Math.ceil(
        totalRelatedCount /
          RELATED_PAGE_SIZE,
      ),
    );

  /*
    현재 페이지
  */
  const currentRelatedPage =
    Number.isInteger(
      requestedRelatedPage,
    ) &&
    requestedRelatedPage > 0
      ? Math.min(
          requestedRelatedPage,
          totalRelatedPages,
        )
      : 1;

  /*
    현재 8개 후기
  */
  const relatedStart =
    (currentRelatedPage - 1) *
    RELATED_PAGE_SIZE;

  const recentReviews =
    allRelatedReviews.slice(
      relatedStart,
      relatedStart +
        RELATED_PAGE_SIZE,
    );

  /*
    페이지 번호 블록
    1~10
    11~20
    21~30
  */
  const pageBlockStart =
    Math.floor(
      (currentRelatedPage - 1) /
        PAGE_BLOCK_SIZE,
    ) *
      PAGE_BLOCK_SIZE +
    1;

  const pageBlockEnd =
    Math.min(
      pageBlockStart +
        PAGE_BLOCK_SIZE -
        1,

      totalRelatedPages,
    );

  const relatedPageNumbers =
    Array.from(
      {
        length:
          pageBlockEnd -
          pageBlockStart +
          1,
      },

      (_, index) =>
        pageBlockStart + index,
    );

  /*
    상세페이지는 그대로 두고
    relatedPage 값만 변경
  */
  function relatedHref(
    page: number,
  ) {
    return `/reviews/${reviewId}?relatedPage=${page}`;
  }

  const createdDate =
    new Date(
      review.created_at,
    ).toLocaleDateString(
      "ko-KR",
    );

  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-review-detail-shell">
        {/* 왼쪽 */}
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        {/* 가운데 */}
        <section className="km-home-center-column dy-review-detail-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          {/* 페이지 제목 */}
          <div className="dy-review-page-heading">
            <h1>
              고객후기
            </h1>

            <span>
              HOME &gt; 고객후기 &gt;
              상세보기
            </span>
          </div>

          <article className="dy-review-detail-board">
            {/* 사진 위 후기 제목 */}
            <div className="dy-review-photo-title">
              DY다이아부동산 고객후기
            </div>

            {/* 본문 */}
            <div className="dy-review-detail-body">
              {images.length > 0 ? (
                <div className="dy-review-detail-images">
                  {images.map(
                    (
                      image,
                      index,
                    ) => (
                      <img
                        key={`${image}-${index}`}
                        src={image}
                        alt={`${
                          review.title ||
                          "고객후기"
                        } ${
                          index + 1
                        }`}
                      />
                    ),
                  )}
                </div>
              ) : null}

              {review.content ? (
                <div className="dy-review-detail-content">
                  {review.content}
                </div>
              ) : null}
            </div>

            {/* 추천 / 반대 */}
            <div className="dy-review-reactions">
              <button
                type="button"
              >
                추천 <b>0</b>
              </button>

              <button
                type="button"
              >
                반대 <b>0</b>
              </button>

              <button
                type="button"
                className="dy-review-share"
              >
                ↗
              </button>
            </div>

            {/* 등록자 / 조회 */}
            <div className="dy-review-meta">
              <span>
                등록자
              </span>

              <strong>
                DY다이아부동산
              </strong>

              <i />

              <span>
                조회
              </span>

              <strong>
                0
              </strong>
            </div>

            {/* 등록 / 목록 */}
            <div className="dy-review-center-buttons">
              <Link
                href="/reviews/write"
                className="dy-dark-button"
              >
                등록
              </Link>

              <Link
                href="/reviews"
                className="dy-dark-button"
              >
                목록
              </Link>
            </div>

            {/* 댓글 입력 */}
            <div className="dy-review-comment-box">
              <textarea
                placeholder="내용을 입력하세요."
                aria-label="댓글 내용"
              />

              <div className="dy-review-comment-bottom">
                <label>
                  <input
                    type="checkbox"
                  />

                  <span>
                    비밀글설정
                  </span>
                </label>

                <button
                  type="button"
                >
                  등록
                </button>
              </div>
            </div>

            {/* 다른 고객후기 */}
            {recentReviews.length >
            0 ? (
              <>
                <div className="dy-review-related-grid">
                  {recentReviews.map(
                    (item) => (
                      <Link
                        href={`/reviews/${item.id}`}
                        className="dy-review-related-card"
                        key={item.id}
                      >
                        <img
                          src={
                            item.thumbnail_url ||
                            "/images/no-image.png"
                          }
                          alt={
                            item.title ||
                            "고객후기"
                          }
                        />

                        <div>
                          {item.title ||
                            "고객후기"}
                        </div>
                      </Link>
                    ),
                  )}
                </div>

                {/* 페이지네이션 */}
                <nav
                  className="dy-review-related-pagination"
                  aria-label="다른 고객후기 페이지"
                >
                  {/* 10페이지 전 */}
                  <Link
                    href={relatedHref(
                      Math.max(
                        1,
                        currentRelatedPage -
                          10,
                      ),
                    )}
                    className={
                      currentRelatedPage <=
                      10
                        ? "is-disabled"
                        : ""
                    }
                    aria-disabled={
                      currentRelatedPage <=
                      10
                    }
                  >
                    &lt;&lt;
                  </Link>

                  {/* 1페이지 전 */}
                  <Link
                    href={relatedHref(
                      Math.max(
                        1,
                        currentRelatedPage -
                          1,
                      ),
                    )}
                    className={
                      currentRelatedPage ===
                      1
                        ? "is-disabled"
                        : ""
                    }
                    aria-disabled={
                      currentRelatedPage ===
                      1
                    }
                  >
                    &lt;
                  </Link>

                  {/* 1~10 페이지 번호 */}
                  {relatedPageNumbers.map(
                    (
                      pageNumber,
                    ) => (
                      <Link
                        key={
                          pageNumber
                        }
                        href={relatedHref(
                          pageNumber,
                        )}
                        className={
                          pageNumber ===
                          currentRelatedPage
                            ? "is-active"
                            : ""
                        }
                      >
                        {pageNumber}
                      </Link>
                    ),
                  )}

                  {/* 1페이지 다음 */}
                  <Link
                    href={relatedHref(
                      Math.min(
                        totalRelatedPages,
                        currentRelatedPage +
                          1,
                      ),
                    )}
                    className={
                      currentRelatedPage ===
                      totalRelatedPages
                        ? "is-disabled"
                        : ""
                    }
                    aria-disabled={
                      currentRelatedPage ===
                      totalRelatedPages
                    }
                  >
                    &gt;
                  </Link>

                  {/* 10페이지 다음 */}
                  <Link
                    href={relatedHref(
                      Math.min(
                        totalRelatedPages,
                        currentRelatedPage +
                          10,
                      ),
                    )}
                    className={
                      currentRelatedPage +
                        10 >
                      totalRelatedPages
                        ? "is-disabled"
                        : ""
                    }
                    aria-disabled={
                      currentRelatedPage +
                        10 >
                      totalRelatedPages
                    }
                  >
                    &gt;&gt;
                  </Link>
                </nav>
              </>
            ) : null}
          </article>
        </section>

        {/* 오른쪽 */}
        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        /*
          ==========================
          전체 레이아웃
          ==========================
        */

        .dy-review-detail-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-review-detail-main {
          width: 100%;
          min-width: 0;
        }

        .dy-review-detail-main
          .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        /*
          ==========================
          페이지 제목
          ==========================
        */

        .dy-review-page-heading {
          min-height: 56px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding: 0 16px;

          border-top: 2px solid #333;
          border-bottom: 1px solid #ddd;

          box-sizing: border-box;
          margin-bottom: 6px;
        }

        .dy-review-page-heading h1 {
          margin: 0;

          color: #222;

          font-size: 20px;
          font-weight: 900;
        }

        .dy-review-page-heading span {
          color: #888;
          font-size: 11px;
        }

        /*
          ==========================
          후기 상세
          ==========================
        */

        .dy-review-detail-board {
          width: 100%;
          min-width: 0;

          background: #fff;
        }

        /*
          ==========================
          사진 위 고객후기 문구
          ==========================
        */

        .dy-review-photo-title {
          width: 100%;

          padding: 24px 18px 8px;

          color: #666;

          font-size: 16px;
          font-weight: 700;

          text-align: center;

          box-sizing: border-box;
        }

        /*
          ==========================
          후기 이미지
          ==========================
        */

        .dy-review-detail-body {
          width: 100%;

          padding: 18px;

          box-sizing: border-box;
        }

        .dy-review-detail-images {
          width: 100%;

          display: flex;
          flex-direction: column;
          align-items: center;

          gap: 18px;
        }

        .dy-review-detail-images
          img {
          display: block;

          width: auto;
          max-width: 100%;

          height: auto;

          object-fit: contain;
        }

        /*
          ==========================
          후기 내용
          ==========================
        */

        .dy-review-detail-content {
          margin-top: 22px;

          padding: 18px 0;

          border-top:
            1px solid #eee;

          color: #555;

          font-size: 13px;
          line-height: 1.9;

          white-space: pre-wrap;

          word-break: break-word;
        }

        /*
          ==========================
          추천 / 반대
          ==========================
        */

        .dy-review-reactions {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          padding: 10px 0 14px;
        }

        .dy-review-reactions
          button {
          min-width: 82px;
          height: 32px;

          border:
            1px solid #d7d7d7;

          background: #fff;

          color: #555;

          font-size: 12px;

          cursor: pointer;
        }

        .dy-review-reactions b {
          color: #e35151;
        }

        .dy-review-reactions
          .dy-review-share {
          width: 40px;
          min-width: 40px;
        }

        /*
          ==========================
          등록자 / 조회
          ==========================
        */

        .dy-review-meta {
          min-height: 52px;

          display: flex;
          align-items: center;

          gap: 10px;

          padding: 0 18px;

          border-top:
            1px solid #ddd;

          border-bottom:
            1px solid #ddd;

          color: #777;

          font-size: 11px;

          box-sizing: border-box;
        }

        .dy-review-meta strong {
          color: #555;
          font-weight: 800;
        }

        .dy-review-meta i {
          width: 1px;
          height: 12px;

          background: #ddd;
        }

        /*
          ==========================
          등록 / 목록
          ==========================
        */

        .dy-review-center-buttons {
          display: flex;
          align-items: center;
          justify-content: center;

          gap: 10px;

          padding: 31px 0 50px;
        }

        .dy-dark-button {
          min-width: 62px;
          height: 36px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid #222;

          border-radius: 3px;

          background:
            linear-gradient(
              #555,
              #222
            );

          color: #fff;

          font-size: 12px;
          font-weight: 800;

          text-decoration: none;
        }

        /*
          ==========================
          댓글 입력
          ==========================
        */

        .dy-review-comment-box {
          width: 100%;

          border:
            1px solid #ddd;

          box-sizing: border-box;
        }

        .dy-review-comment-box
          textarea {
          display: block;

          width: 100%;
          height: 110px;

          padding: 16px;

          border: 0;
          outline: 0;

          resize: vertical;

          color: #555;

          font-family: inherit;
          font-size: 13px;

          box-sizing: border-box;
        }

        .dy-review-comment-box
          textarea::placeholder {
          color: #aaa;
          font-weight: 700;
        }

        .dy-review-comment-bottom {
          height: 48px;

          display: flex;
          align-items: stretch;
          justify-content: space-between;

          border-top:
            1px solid #ddd;
        }

        .dy-review-comment-bottom
          label {
          display: flex;
          align-items: center;

          gap: 5px;

          padding-left: 15px;

          color: #666;

          font-size: 12px;
        }

        .dy-review-comment-bottom
          input {
          width: 19px;
          height: 19px;
        }

        .dy-review-comment-bottom
          button {
          width: 70px;

          border: 0;

          background: #3d9ee8;

          color: #fff;

          font-size: 13px;
          font-weight: 800;

          cursor: pointer;
        }

        /*
          ==========================
          다른 고객후기 4 x 2
          ==========================
        */

        .dy-review-related-grid {
          margin-top: 48px;

          display: grid;

          grid-template-columns:
            repeat(
              4,
              minmax(0, 1fr)
            );

          gap: 20px;
        }

        .dy-review-related-card {
          min-width: 0;

          display: block;

          border:
            1px solid #d8d8d8;

          background: #fff;

          color: #222;

          text-decoration: none;

          overflow: hidden;
        }

        .dy-review-related-card
          img {
          width: 100%;

          aspect-ratio:
            1.3 / 1;

          display: block;

          object-fit: cover;

          background: #eee;
        }

        .dy-review-related-card
          div {
          min-height: 72px;

          display: flex;
          align-items: center;
          justify-content: center;

          padding: 8px;

          color: #333;

          font-size: 13px;
          font-weight: 700;

          text-align: center;

          box-sizing: border-box;
        }

        /*
          ==========================
          페이지네이션
          << < 1 2 ... 10 > >>
          ==========================
        */

        .dy-review-related-pagination {
          margin: 25px 0 8px;

          display: flex;
          align-items: center;
          justify-content: center;

          gap: 0;
        }

        .dy-review-related-pagination
          a {
          min-width: 32px;
          height: 32px;

          padding: 0 7px;

          display: inline-flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid #ddd;

          border-right: 0;

          background: #fff;

          color: #555;

          font-size: 12px;

          text-decoration: none;

          box-sizing: border-box;
        }

        .dy-review-related-pagination
          a:last-child {
          border-right:
            1px solid #ddd;
        }

        .dy-review-related-pagination
          a.is-active {
          color: #00a7d8;

          font-weight: 800;
        }

        .dy-review-related-pagination
          a.is-disabled {
          color: #bbb;

          background: #f8f8f8;

          pointer-events: none;
        }

        /*
          ==========================
          태블릿
          ==========================
        */

        @media (
          max-width: 1150px
        ) {
          .dy-review-detail-shell {
            grid-template-columns:
              210px
              minmax(
                0,
                1fr
              ) !important;
          }

          .dy-review-detail-shell
            .km-home-right-column {
            display: none !important;
          }

          .dy-review-related-grid {
            grid-template-columns:
              repeat(
                3,
                minmax(
                  0,
                  1fr
                )
              );
          }
        }

        /*
          ==========================
          모바일
          ==========================
        */

        @media (
          max-width: 820px
        ) {
          .dy-review-detail-shell {
            width:
              calc(
                100% - 16px
              ) !important;

            grid-template-columns:
              1fr !important;
          }

          .dy-review-detail-shell
            .km-home-left-column,
          .dy-review-detail-shell
            .km-home-right-column {
            display: none !important;
          }

          .dy-review-page-heading {
            align-items:
              flex-start;

            flex-direction:
              column;

            padding-top: 14px;
            padding-bottom: 14px;
          }

          .dy-review-related-grid {
            grid-template-columns:
              repeat(
                2,
                minmax(
                  0,
                  1fr
                )
              );

            gap: 12px;
          }
        }

        @media (
          max-width: 520px
        ) {
          .dy-review-related-grid {
            grid-template-columns:
              1fr;
          }
        }
      `}</style>
    </>
  );
}