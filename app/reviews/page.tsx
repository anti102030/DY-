import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { ReviewRow } from "@/lib/reviewTypes";
import InnerPageTop from "@/components/InnerPageTop";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import Footer from "@/components/Footer";
import BrandWatermark from "@/components/BrandWatermark";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const DEFAULT_PAGE_SIZE = 12;
const PAGE_BLOCK_SIZE = 10;
const PAGE_SIZE_OPTIONS = [
  10, 20, 30, 40, 50, 60, 70, 80,
  100, 200, 300, 500, 1000,
] as const;

type ReviewSearchField = "통합검색" | "제목" | "등록자" | "내용";

type ReviewsSearchParams = {
  page?: string;
  searchField?: string;
  keyword?: string;
  pageSize?: string;
};

type ReviewSearchableRow = ReviewRow & {
  content?: string | null;
};

function toPositiveInteger(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    return fallback;
  }

  return parsed;
}

function getSearchField(value: string | undefined): ReviewSearchField {
  if (
    value === "제목" ||
    value === "등록자" ||
    value === "내용"
  ) {
    return value;
  }

  return "통합검색";
}

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function createReviewsHref({
  page,
  searchField,
  keyword,
  pageSize,
}: {
  page: number;
  searchField: ReviewSearchField;
  keyword: string;
  pageSize: number;
}) {
  const params = new URLSearchParams();

  params.set("page", String(page));

  if (searchField !== "통합검색") {
    params.set("searchField", searchField);
  }

  if (keyword) {
    params.set("keyword", keyword);
  }

  if (pageSize !== DEFAULT_PAGE_SIZE) {
    params.set("pageSize", String(pageSize));
  }

  return `/reviews?${params.toString()}`;
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams?: Promise<ReviewsSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const requestedPage = toPositiveInteger(
    resolvedSearchParams.page,
    1,
  );

  const searchField = getSearchField(
    resolvedSearchParams.searchField,
  );

  const keyword = resolvedSearchParams.keyword?.trim() || "";

  const requestedPageSize = toPositiveInteger(
    resolvedSearchParams.pageSize,
    DEFAULT_PAGE_SIZE,
  );

  const pageSize = PAGE_SIZE_OPTIONS.includes(
    requestedPageSize as (typeof PAGE_SIZE_OPTIONS)[number],
  )
    ? requestedPageSize
    : DEFAULT_PAGE_SIZE;

  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("status", "공개")
    .order("id", { ascending: false });

  const allReviews = (data ?? []) as ReviewSearchableRow[];
  const normalizedKeyword = normalize(keyword);

  const filteredReviews = normalizedKeyword
    ? allReviews.filter((review) => {
        const title = normalize(review.title);
        const author = normalize(review.author);
        const content = normalize(review.content);

        if (searchField === "제목") {
          return title.includes(normalizedKeyword);
        }

        if (searchField === "등록자") {
          return author.includes(normalizedKeyword);
        }

        if (searchField === "내용") {
          return content.includes(normalizedKeyword);
        }

        return `${title} ${author} ${content}`.includes(
          normalizedKeyword,
        );
      })
    : allReviews;

  const totalCount = filteredReviews.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(requestedPage, totalPages);

  const rangeStart = (currentPage - 1) * pageSize;
  const rangeEnd = rangeStart + pageSize;

  const reviews = filteredReviews.slice(rangeStart, rangeEnd);

  const bestReview =
    allReviews.find((review) => review.is_best) ??
    allReviews[0] ??
    null;

  const gridReviews = reviews;

  const pageBlockStart =
    Math.floor((currentPage - 1) / PAGE_BLOCK_SIZE) *
      PAGE_BLOCK_SIZE +
    1;

  const pageBlockEnd = Math.min(
    pageBlockStart + PAGE_BLOCK_SIZE - 1,
    totalPages,
  );

  const pageNumbers = Array.from(
    { length: pageBlockEnd - pageBlockStart + 1 },
    (_, index) => pageBlockStart + index,
  );

  const makeHref = (page: number) =>
    createReviewsHref({
      page,
      searchField,
      keyword,
      pageSize,
    });

  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-reviews-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-reviews-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          <section className="dy-best-review">
            <div className="dy-best-review-title">
              <span>◆</span>
              <h1>DY다이아부동산 BEST REVIEW</h1>
              <span>◆</span>
            </div>

            {error ? (
              <p className="dy-review-error">
                후기 불러오기 실패: {error.message}
              </p>
            ) : null}

            <div className="dy-featured-review-grid">
              {bestReview ? (
                <Link
                  href={`/reviews/${bestReview.id}`}
                  className="dy-featured-review-card"
                >
                  <img
                    src={
                      bestReview.thumbnail_url ||
                      "/images/no-image.png"
                    }
                    alt={bestReview.title || "고객 베스트 후기"}
                  />

                  <div>
                    <strong>
                      {bestReview.title || "고객 베스트 후기"}
                    </strong>

                    <span>고객 베스트 후기</span>
                  </div>
                </Link>
              ) : (
                <div className="dy-featured-review-card">
                  <span className="dy-review-watermark-empty">
                    <BrandWatermark className="dy-review-page-watermark" />
                  </span>

                  <div>
                    <strong>고객 베스트 후기</strong>
                    <span>베스트 후기를 지정해주세요.</span>
                  </div>
                </div>
              )}

              <div className="dy-featured-review-card dy-fixed-promo-card">
                <img
                  src="/best-review-tv.png"
                  alt="베스트후기 및 입주자 추첨 75인치 삼성 4K TV 증정"
                />
              </div>
            </div>

            <div className="dy-review-banner">
              <strong>
                담당직원에게 후기 전달 시 등록 가능
              </strong>
            </div>
          </section>

          {gridReviews.length > 0 ? (
            <div className="dy-review-card-grid">
              {gridReviews.map((review) => (
                <Link
                  href={`/reviews/${review.id}`}
                  className="dy-review-card"
                  key={review.id}
                >
                  <span className="dy-review-watermark-image">
                    <img
                      src={
                        review.thumbnail_url ||
                        "/images/no-image.png"
                      }
                      alt={review.title || "고객후기"}
                    />
                    <BrandWatermark className="dy-review-page-watermark" />
                  </span>

                  <div>
                    <h2>{review.title || "고객후기"}</h2>
                    <p>
                      {review.author ||
                        "DY다이아부동산 고객후기"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="km-kookmin-empty">
              {keyword
                ? "검색 결과가 없습니다."
                : "아직 등록된 고객후기가 없습니다."}
            </div>
          ) : null}

          <div className="dy-review-board-actions">
            <Link href="/reviews/write">글쓰기</Link>
          </div>

          <nav
            className="dy-review-pagination"
            aria-label="고객후기 페이지"
          >
            <Link
              href={makeHref(Math.max(1, pageBlockStart - 10))}
              className={
                pageBlockStart === 1 ? "is-disabled" : ""
              }
              aria-disabled={pageBlockStart === 1}
            >
              &lt;&lt;
            </Link>

            <Link
              href={makeHref(Math.max(1, currentPage - 1))}
              className={
                currentPage === 1 ? "is-disabled" : ""
              }
              aria-disabled={currentPage === 1}
            >
              &lt;
            </Link>

            {pageNumbers.map((pageNumber) => (
              <Link
                key={pageNumber}
                href={makeHref(pageNumber)}
                className={
                  pageNumber === currentPage
                    ? "is-active"
                    : ""
                }
              >
                {pageNumber}
              </Link>
            ))}

            <Link
              href={makeHref(
                Math.min(totalPages, currentPage + 1),
              )}
              className={
                currentPage === totalPages
                  ? "is-disabled"
                  : ""
              }
              aria-disabled={currentPage === totalPages}
            >
              &gt;
            </Link>

            <Link
              href={makeHref(
                Math.min(totalPages, pageBlockStart + 10),
              )}
              className={
                pageBlockEnd >= totalPages
                  ? "is-disabled"
                  : ""
              }
              aria-disabled={pageBlockEnd >= totalPages}
            >
              &gt;&gt;
            </Link>
          </nav>

          <form
            className="dy-review-search-box"
            action="/reviews"
            method="get"
          >
            <span>검색</span>

            <select
              name="searchField"
              defaultValue={searchField}
              aria-label="검색 범위"
            >
              <option value="통합검색">통합검색</option>
              <option value="제목">제목</option>
              <option value="등록자">등록자</option>
              <option value="내용">내용</option>
            </select>

            <input
              type="text"
              name="keyword"
              defaultValue={keyword}
              placeholder="검색어"
            />

            <select
              name="pageSize"
              defaultValue={String(pageSize)}
              aria-label="목록 수"
            >
              <option value="">목록수</option>

              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>

            <button type="submit">검색하기</button>
          </form>
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-reviews-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-reviews-main {
          width: 100%;
          min-width: 0;
        }

        .dy-reviews-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        .dy-best-review {
          width: 100%;
          border: 1px solid #d8d8d8;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-best-review-title {
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-bottom: 1px solid #ddd;
          background: linear-gradient(
            90deg,
            #fff 0%,
            #f5d36e 24%,
            #fff3bd 50%,
            #f5d36e 76%,
            #fff 100%
          );
        }

        .dy-best-review-title h1 {
          margin: 0;
          color: #111;
          font-size: 23px;
          font-weight: 900;
          letter-spacing: 0.5px;
          text-align: center;
        }

        .dy-best-review-title span {
          color: #d8a416;
          font-size: 13px;
        }

        .dy-featured-review-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          padding: 12px;
        }

        .dy-featured-review-card {
          min-width: 0;
          display: block;
          border: 1px solid #d8d8d8;
          background: #fff;
          color: inherit;
          text-decoration: none;
          overflow: hidden;
        }

        .dy-featured-review-card img {
          width: 100%;
          height: 255px;
          display: block;
          object-fit: cover;
        }

        .dy-fixed-promo-card {
          pointer-events: none;
        }

        .dy-fixed-promo-card img {
          width: 100%;
          height: 313px;
          display: block;
          object-fit: cover;
        }

        .dy-fixed-promo-card > div {
          display: none;
        }

        .dy-featured-review-card div {
          min-height: 58px;
          padding: 10px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          box-sizing: border-box;
        }

        .dy-featured-review-card strong {
          min-width: 0;
          color: #222;
          font-size: 15px;
          font-weight: 800;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dy-featured-review-card span {
          color: #777;
          font-size: 11px;
          white-space: nowrap;
        }

        .dy-review-banner {
          min-height: 76px;
          padding: 14px 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-top: 1px solid #d7d7d7;
          background: linear-gradient(
            90deg,
            #d9c79f 0%,
            #f6ecd0 48%,
            #c6b28c 100%
          );
          box-sizing: border-box;
        }

        .dy-review-banner strong {
          color: #222;
          font-size: 24px;
          font-weight: 700;
          text-align: center;
          letter-spacing: -0.8px;
        }

        .dy-review-card-grid {
          margin-top: 20px;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .dy-review-card {
          min-width: 0;
          display: block;
          border: 1px solid #d5d5d5;
          background: #fff;
          color: inherit;
          text-decoration: none;
          overflow: hidden;
        }

        .dy-review-card img {
          width: 100%;
          aspect-ratio: 1 / 1;
          display: block;
          object-fit: cover;
          background: #f3f3f3;
        }

        .dy-review-card div {
          min-height: 72px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          text-align: center;
        }

        .dy-review-card h2 {
          width: 100%;
          margin: 0;
          color: #333;
          font-size: 13px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dy-review-card p {
          width: 100%;
          margin: 5px 0 0;
          color: #777;
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .dy-review-board-actions {
          margin-top: 24px;
          display: flex;
          justify-content: flex-end;
        }

        .dy-review-board-actions a {
          min-width: 68px;
          height: 34px;
          padding: 0 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #d2d2d2;
          background: #fff;
          color: #555;
          font-size: 12px;
          font-weight: 700;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dy-review-pagination {
          margin: 28px 0 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
        }

        .dy-review-pagination a {
          min-width: 32px;
          height: 32px;
          padding: 0 7px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #ddd;
          border-right: 0;
          background: #fff;
          color: #555;
          font-size: 12px;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dy-review-pagination a:last-child {
          border-right: 1px solid #ddd;
        }

        .dy-review-pagination a.is-active {
          color: #00a7d8;
          font-weight: 800;
        }

        .dy-review-pagination a.is-disabled {
          color: #bbb;
          background: #f8f8f8;
          pointer-events: none;
        }

        .dy-review-search-box {
          width: 100%;
          margin: 0;
          padding: 16px 28px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 6px;
          border: 1px solid #dedede;
          background: #fff;
          box-sizing: border-box;
        }

        .dy-review-search-box > span {
          width: 54px;
          color: #444;
          font-size: 13px;
          font-weight: 400;
          white-space: nowrap;
        }

        .dy-review-search-box select,
        .dy-review-search-box input {
          height: 34px;
          padding: 0 9px;
          border: 1px solid #d5d5d5;
          border-radius: 0;
          background: #fff;
          color: #555;
          font-size: 12px;
          box-sizing: border-box;
        }

        .dy-review-search-box select:first-of-type {
          width: 112px;
        }

        .dy-review-search-box input {
          width: 220px;
        }

        .dy-review-search-box select:last-of-type {
          width: 92px;
        }

        .dy-review-search-box button {
          width: 82px;
          height: 34px;
          padding: 0;
          border: 1px solid #4b4b4b;
          background: #4b4b4b;
          color: #fff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .dy-review-error {
          margin: 12px;
          color: #c62828;
          font-size: 12px;
          font-weight: 700;
        }

        @media (max-width: 1150px) {
          .dy-reviews-shell {
            grid-template-columns:
              210px minmax(0, 1fr) !important;
          }

          .dy-reviews-shell .km-home-right-column {
            display: none !important;
          }

          .dy-review-card-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .dy-reviews-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
          }

          .dy-reviews-shell .km-home-left-column,
          .dy-reviews-shell .km-home-right-column {
            display: none !important;
          }

          .dy-featured-review-grid {
            grid-template-columns: 1fr;
          }

          .dy-review-card-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .dy-review-search-box {
            padding: 14px;
            flex-wrap: wrap;
          }

          .dy-review-search-box > span {
            width: 100%;
          }

          .dy-review-search-box input {
            flex: 1 1 180px;
            width: auto;
          }
        }

        @media (max-width: 520px) {
          .dy-best-review-title h1 {
            font-size: 17px;
          }

          .dy-featured-review-card img {
            height: 210px;
          }

          .dy-review-banner strong {
            font-size: 18px;
          }

          .dy-review-card-grid {
            grid-template-columns: 1fr;
          }
        }

        .dy-review-watermark-image,
        .dy-review-watermark-empty {
          position: relative;
          display: block;
          width: 100%;
          overflow: hidden;
        }

        .dy-review-watermark-image > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dy-review-watermark-empty {
          min-height: 220px;
          background: #090909;
        }

        .dy-review-watermark-image .dy-review-page-watermark,
        .dy-review-watermark-empty .dy-review-page-watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 36%;
          max-width: 210px;
          height: auto;
          transform: translate(-50%, -50%);
          object-fit: contain;
          opacity: 0.30;
          pointer-events: none;
          user-select: none;
          z-index: 4;
        }

        @media (max-width: 760px) {
          .dy-review-watermark-image .dy-review-page-watermark,
          .dy-review-watermark-empty .dy-review-page-watermark {
            width: 40%;
            opacity: 0.34;
          }
        }
      `}</style>
    </>
  );
}
