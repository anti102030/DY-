import Link from "next/link";
import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import { supabase } from "@/lib/supabase";
import type { PropertyRow } from "@/lib/propertyTypes";
import InnerPageTop from "@/components/InnerPageTop";
import {
  seoulDistricts,
  gyeonggiCities,
  incheonDistricts,
  getNeighborhoods,
} from "@/lib/homeData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SearchParams = Promise<{
  city?: string;
  district?: string;
  neighborhood?: string;
  property_type?: string;
  keyword?: string;
  rooms?: string;
  price?: string;
  deposit?: string;
  deposit_max?: string;
  feature?: string;
  page?: string;
}>;

type FilterHrefOptions = {
  district?: string;
  neighborhood?: string;
  page?: number;
};

const PAGE_SIZE = 10;
const CONTACT_NUMBER = "010-8426-8616";
const CONTACT_TEL = "01075854574";
const FALLBACK_IMAGE = "/images/property-placeholder.jpg";

function getCityDisplayName(city?: string) {
  if (city === "서울") return "서울특별시";
  if (city === "경기") return "경기도";
  if (city === "인천") return "인천광역시";

  return city || "";
}

function getDistrictItems(city?: string) {
  if (city === "서울") return seoulDistricts;
  if (city === "경기") return gyeonggiCities;
  if (city === "인천") return incheonDistricts;

  return [];
}

function cleanSearchValue(value?: string) {
  return (value || "")
    .trim()
    .replace(/[,%()]/g, " ")
    .replace(/\s+/g, " ");
}

function getPriceSearchTerms(price?: string) {
  if (price === "1억대") return ["1억"];
  if (price === "2억대") return ["2억"];
  if (price === "3억대") return ["3억"];
  if (price === "4억대") return ["4억"];
  if (price === "5억이상") return ["5억", "6억", "7억", "8억", "9억", "10억"];

  return [];
}

function getLocationText(property: PropertyRow) {
  return [
    getCityDisplayName(property.city),
    property.district,
    property.neighborhood,
  ]
    .filter(Boolean)
    .join(" ");
}

function getPropertySummary(property: PropertyRow) {
  const summary = [
    property.area_pyeong ? `${property.area_pyeong}평` : "면적문의",
    property.rooms ? `방 ${property.rooms}개` : "방 문의",
    property.bathrooms ? `욕실 ${property.bathrooms}개` : "욕실 문의",
    property.floor || "",
    property.direction || "",
  ].filter(Boolean);

  return summary.join(" · ");
}

function getDescriptionPreview(description?: string | null) {
  const text = (description || "상세정보는 문의해 주세요.")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= 105) return text;

  return `${text.slice(0, 105)}…`;
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const parsedPage = Number(params.page || "1");
  const currentPage =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? Math.floor(parsedPage)
      : 1;

  const from = (currentPage - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("properties")
    .select("*", { count: "exact" })
    .eq("status", "공개")
    .order("id", { ascending: false })
    .range(from, to);

  if (params.city) {
    query = query.eq("city", params.city);
  }

  if (params.district) {
    query = query.eq("district", params.district);
  }

  if (params.neighborhood) {
    query = query.eq("neighborhood", params.neighborhood);
  }

  if (params.property_type) {
    query = query.eq("property_type", params.property_type);
  }

  if (params.rooms) {
    const roomCount = Number(params.rooms);

    if (Number.isFinite(roomCount)) {
      query =
        roomCount >= 5
          ? query.gte("rooms", 5)
          : query.eq("rooms", roomCount);
    }
  }

  const keyword = cleanSearchValue(params.keyword);

  if (keyword) {
    query = query.or(
      [
        `title.ilike.%${keyword}%`,
        `address.ilike.%${keyword}%`,
        `city.ilike.%${keyword}%`,
        `district.ilike.%${keyword}%`,
        `neighborhood.ilike.%${keyword}%`,
        `description.ilike.%${keyword}%`,
      ].join(",")
    );
  }

  const priceTerms = getPriceSearchTerms(params.price);

  if (priceTerms.length > 0) {
    query = query.or(
      priceTerms.map((term) => `price.ilike.%${term}%`).join(",")
    );
  }

  if (params.deposit === "0") {
    query = query.or(
      [
        "deposit.eq.0",
        "deposit.eq.0원",
        "deposit.ilike.%무입주금%",
        "deposit.ilike.%입주금 없음%",
      ].join(",")
    );
  }

  if (params.deposit_max) {
    const safeDepositMax = cleanSearchValue(params.deposit_max);

    if (safeDepositMax) {
      query = query.or(
        [
          `deposit.ilike.%${safeDepositMax}%`,
          `description.ilike.%입주금 ${safeDepositMax}%`,
        ].join(",")
      );
    }
  }

  if (params.feature) {
    const featureKeyword =
      params.feature === "테라스복층"
        ? "테라스"
        : cleanSearchValue(params.feature);

    if (featureKeyword) {
      query = query.or(
        [
          `title.ilike.%${featureKeyword}%`,
          `description.ilike.%${featureKeyword}%`,
        ].join(",")
      );
    }
  }

  const { data, error, count } = await query;

  const properties = (data ?? []) as PropertyRow[];
  const totalCount = count ?? 0;
  const totalPages = Math.max(Math.ceil(totalCount / PAGE_SIZE), 1);
  const safeCurrentPage = Math.min(currentPage, totalPages);

  let neighborhoodQuery = supabase
    .from("properties")
    .select("neighborhood")
    .eq("status", "공개")
    .not("neighborhood", "is", null)
    .order("neighborhood", { ascending: true });

  if (params.city) {
    neighborhoodQuery = neighborhoodQuery.eq("city", params.city);
  }

  if (params.district) {
    neighborhoodQuery = neighborhoodQuery.eq("district", params.district);
  }

  const { data: neighborhoodData } = await neighborhoodQuery;

  const dbNeighborhoods = (neighborhoodData ?? [])
    .map((item) => item.neighborhood?.trim())
    .filter((item): item is string => Boolean(item));

  const staticNeighborhoods = params.district
    ? getNeighborhoods(params.city, params.district)
    : [];

  const neighborhoods = Array.from(
    new Set([...staticNeighborhoods, ...dbNeighborhoods])
  ).sort((a, b) => a.localeCompare(b, "ko"));

  const districtItems = getDistrictItems(params.city);

  function buildFilterHref({
    district,
    neighborhood,
    page,
  }: FilterHrefOptions = {}) {
    const search = new URLSearchParams();

    if (params.city) {
      search.set("city", params.city);
    }

    if (district !== undefined) {
      if (district) {
        search.set("district", district);
      }
    } else if (params.district) {
      search.set("district", params.district);
    }

    if (neighborhood !== undefined) {
      if (neighborhood) {
        search.set("neighborhood", neighborhood);
      }
    } else if (params.neighborhood) {
      search.set("neighborhood", params.neighborhood);
    }

    if (params.property_type) {
      search.set("property_type", params.property_type);
    }

    if (params.keyword) {
      search.set("keyword", params.keyword);
    }

    if (params.rooms) {
      search.set("rooms", params.rooms);
    }

    if (params.price) {
      search.set("price", params.price);
    }

    if (params.deposit) {
      search.set("deposit", params.deposit);
    }

    if (params.deposit_max) {
      search.set("deposit_max", params.deposit_max);
    }

    if (params.feature) {
      search.set("feature", params.feature);
    }

    if (page && page > 1) {
      search.set("page", String(page));
    }

    const queryString = search.toString();

    return queryString ? `/listings?${queryString}` : "/listings";
  }

  const cityDisplayName = getCityDisplayName(params.city);
  const locationTitle = [
    cityDisplayName,
    params.district,
    params.neighborhood,
  ]
    .filter(Boolean)
    .join(" ");

  const resultTitle = locationTitle
    ? `${locationTitle} 분양매물`
    : "전체 분양매물";

  const activeFilterCount = [
    params.city,
    params.district,
    params.neighborhood,
    params.property_type,
    params.keyword,
    params.rooms,
    params.price,
    params.deposit,
    params.deposit_max,
    params.feature,
  ].filter(Boolean).length;

  const confirmedDate = new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());

  return (
    <>
      <InnerPageTop />

      <main className="km-home-layout dy-listings-shell">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column dy-listings-main">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          {params.city && !params.district && districtItems.length > 0 && (
            <section
              className="km-location-selector"
              aria-labelledby="km-district-title"
            >
              <div className="km-location-heading">
                <div>
                  <span>지역 선택</span>
                  <h1 id="km-district-title">{cityDisplayName}</h1>
                </div>

                <Link href="/listings">전체 매물 보기</Link>
              </div>

              <div className="km-location-grid">
                {districtItems.map((district) => (
                  <Link
                    key={district}
                    href={buildFilterHref({
                      district,
                      neighborhood: "",
                    })}
                  >
                    {district}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {params.district && (
            <section
              className="km-location-selector"
              aria-labelledby="km-neighborhood-title"
            >
              <div className="km-location-heading">
                <div>
                  <span>상세 지역 선택</span>
                  <h1 id="km-neighborhood-title">
                    {cityDisplayName} {params.district}
                  </h1>
                </div>

                <Link
                  href={buildFilterHref({
                    neighborhood: "",
                  })}
                >
                  동 전체
                </Link>
              </div>

              {neighborhoods.length > 0 ? (
                <div className="km-location-grid">
                  {neighborhoods.map((neighborhood) => {
                    const isActive =
                      neighborhood === params.neighborhood;

                    return (
                      <Link
                        key={neighborhood}
                        href={buildFilterHref({ neighborhood })}
                        className={isActive ? "is-active" : ""}
                      >
                        {neighborhood}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="km-location-empty">
                  등록된 동 정보가 없습니다.
                </div>
              )}
            </section>
          )}

          <section className="km-listing-result-heading">
            <div>
              {locationTitle && (
                <span className="km-listing-kicker">{locationTitle}</span>
              )}
              <h1>{locationTitle ? resultTitle : "매물정보"}</h1>
              <p>
                총 <strong>{totalCount.toLocaleString("ko-KR")}</strong>개의
                매물이 검색되었습니다.
              </p>
            </div>

            <div className="km-listing-heading-actions">
              {activeFilterCount > 0 && (
                <span>검색조건 {activeFilterCount}개 적용</span>
              )}

              <Link href="/listings">검색 초기화</Link>
            </div>
          </section>

          {error && (
            <div className="km-listing-error" role="alert">
              <strong>매물을 불러오지 못했습니다.</strong>
              <span>{error.message}</span>
            </div>
          )}

          <section className="km-listing-list" aria-label="매물 검색 결과">
            {properties.map((property) => (
              <article className="km-listing-item" key={property.id}>
                <Link
                  href={`/listings/${property.id}`}
                  className="km-listing-thumb"
                  aria-label={`${property.title} 상세보기`}
                >
                  <img
                    src={property.thumbnail_url || FALLBACK_IMAGE}
                    alt={property.title || "매물 이미지"}
                  />

                  <span className="km-listing-image-number">
                    매물번호 {property.id}
                  </span>
                </Link>

                <div className="km-listing-content">
                  <div className="km-listing-badges">
                    <span className="km-safe-badge">안심인증</span>
                    <span>{confirmedDate} 확인</span>
                    <span>{property.property_type || "매물"}</span>
                  </div>

                  <p className="km-listing-address">
                    {getLocationText(property) || "지역 정보 문의"}
                  </p>

                  <Link
                    href={`/listings/${property.id}`}
                    className="km-listing-title-link"
                  >
                    <h2>{property.title || "제목 미입력"}</h2>
                  </Link>

                  <p className="km-listing-summary">
                    {getPropertySummary(property)}
                  </p>

                  <p className="km-listing-detail-text">
                    {getDescriptionPreview(property.description)}
                  </p>

                  <div className="km-listing-price-row">
                    <div>
                      <span className="km-chip km-chip-blue">분양가</span>
                      <b>{property.price || "문의"}</b>
                    </div>

                    <div>
                      <span className="km-chip km-chip-pink">입주금</span>
                      <b>{property.deposit || "문의"}</b>
                    </div>

                    <div>
                      <span className="km-chip km-chip-green">융자금</span>
                      <b>{property.loan || "문의"}</b>
                    </div>
                  </div>
                </div>

                <aside className="km-listing-manager">
                  <span className="km-manager-label">매물 상담</span>
                  <strong>DY다이아부동산</strong>
                  <a href={`tel:${CONTACT_TEL}`}>{CONTACT_NUMBER}</a>
                  <span className="km-manager-safe">365일 상담 가능</span>

                  <Link
                    href={`/listings/${property.id}`}
                    className="km-manager-detail-button"
                  >
                    상세정보 보기
                  </Link>
                </aside>
              </article>
            ))}

            {properties.length === 0 && !error && (
              <div className="km-listing-empty">
                <strong>조건에 맞는 매물이 없습니다.</strong>
                <p>
                  지역이나 가격 조건을 조금 넓혀 다시 검색해 주세요.
                </p>
                <Link href="/listings">전체 매물 보기</Link>
              </div>
            )}
          </section>

          {!error && totalPages > 1 && (
            <nav
              className="km-listing-pagination"
              aria-label="페이지 이동"
            >
              <Link
                href={buildFilterHref({
                  page: Math.max(safeCurrentPage - 1, 1),
                })}
                className={
                  safeCurrentPage <= 1 ? "is-disabled" : ""
                }
                aria-disabled={safeCurrentPage <= 1}
                tabIndex={safeCurrentPage <= 1 ? -1 : undefined}
              >
                ‹
              </Link>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              )
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - safeCurrentPage) <= 2
                )
                .map((page, index, pages) => {
                  const previous = pages[index - 1];
                  const showDots =
                    Boolean(previous) && page - previous > 1;

                  return (
                    <span className="km-page-item-wrap" key={page}>
                      {showDots && (
                        <span className="km-page-dots">…</span>
                      )}

                      <Link
                        href={buildFilterHref({ page })}
                        className={
                          page === safeCurrentPage ? "is-active" : ""
                        }
                        aria-current={
                          page === safeCurrentPage ? "page" : undefined
                        }
                      >
                        {page}
                      </Link>
                    </span>
                  );
                })}

              <Link
                href={buildFilterHref({
                  page: Math.min(safeCurrentPage + 1, totalPages),
                })}
                className={
                  safeCurrentPage >= totalPages ? "is-disabled" : ""
                }
                aria-disabled={safeCurrentPage >= totalPages}
                tabIndex={
                  safeCurrentPage >= totalPages ? -1 : undefined
                }
              >
                ›
              </Link>
            </nav>
          )}
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
        .dy-listings-shell {
          align-items: start !important;
          margin-top: 18px !important;
          margin-bottom: 34px !important;
        }

        .dy-listings-main {
          width: 100%;
          min-width: 0;
        }

        .dy-listings-main .km-home-search-wrap {
          width: 100%;
          margin-bottom: 14px !important;
        }

        @media (max-width: 1150px) {
          .dy-listings-shell {
            grid-template-columns: 210px minmax(0, 1fr) !important;
          }

          .dy-listings-shell .km-home-right-column {
            display: none !important;
          }
        }

        @media (max-width: 820px) {
          .dy-listings-shell {
            width: calc(100% - 16px) !important;
            grid-template-columns: 1fr !important;
            margin-bottom: 24px !important;
          }

          .dy-listings-shell .km-home-left-column,
          .dy-listings-shell .km-home-right-column {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
