import Link from "next/link";
import Header from "@/components/Header";
import MainBannerSlider from "@/components/MainBannerSlider";
import ReviewsSection from "@/components/ReviewsSection";
import QuickConsultCard from "@/components/QuickConsultCard";
import LeftSidebar from "@/components/LeftSidebar";
import SearchPanel from "@/components/SearchPanel";
import PropertySection from "@/components/PropertySection";
import RightSidebar from "@/components/RightSidebar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { getNeighborhoods } from "@/lib/regionNeighborhoods";
import type { PropertyRow } from "@/lib/propertyTypes";
import type { Property } from "@/lib/homeData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOME_LIMIT = 6;
const REGION_LIMIT = 30;

type HomeSearchParams = {
  city?: string;
  district?: string;
  neighborhood?: string;
};

const CITY_LABELS: Record<string, string> = {
  서울: "서울특별시",
  경기: "경기도",
  인천: "인천광역시",
};

function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    createdAt: row.created_at,
    title: row.title || "제목 미입력",
    image: row.thumbnail_url || "",
    location:
      row.neighborhood || row.district || row.city || "지역 미입력",
    city: row.city || "",
    district: row.district || "",
    neighborhood: row.neighborhood || "",
    listingBadge: row.listing_badge || "신축분양",
    rooms: row.rooms || 0,
    bathrooms: row.bathrooms || 0,
    areaPyeong: row.area_pyeong,
    price: row.price || "-",
    deposit: row.deposit || "-",
    loan: row.loan || "-",
  };
}

async function getByCity(city: string): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "공개")
    .eq("city", city)
    .order("id", { ascending: false })
    .limit(HOME_LIMIT);

  if (error) {
    console.error(`[홈] ${city} 매물 불러오기 오류:`, error);
    return [];
  }

  return ((data ?? []) as PropertyRow[]).map(toProperty);
}

async function getByRegion(
  city: string,
  district?: string,
  neighborhood?: string,
): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "공개")
    .eq("city", city);

  if (district) {
    query = query.eq("district", district);
  }

  if (neighborhood) {
    query = query.eq("neighborhood", neighborhood);
  }

  const { data, error } = await query
    .order("id", { ascending: false })
    .limit(REGION_LIMIT);

  if (error) {
    console.error(
      `[홈 지역필터] ${city} ${district ?? ""} ${neighborhood ?? ""} 매물 불러오기 오류:`,
      error,
    );
    return [];
  }

  return ((data ?? []) as PropertyRow[]).map(toProperty);
}

async function getLowDeposit(): Promise<Property[]> {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "공개")
    .not("deposit", "is", null)
    .neq("deposit", "")
    .order("id", { ascending: false })
    .limit(HOME_LIMIT);

  if (error) {
    console.error("[홈] 낮은 실입주금 매물 불러오기 오류:", error);
    return [];
  }

  return ((data ?? []) as PropertyRow[]).map(toProperty);
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const selectedCity = resolvedSearchParams.city?.trim() || "";
  const selectedDistrict = resolvedSearchParams.district?.trim() || "";
  const selectedNeighborhood =
    resolvedSearchParams.neighborhood?.trim() || "";

  const hasRegionFilter = Boolean(selectedCity);
  const neighborhoods = getNeighborhoods(
    selectedCity,
    selectedDistrict,
  );

  let seoul: Property[] = [];
  let gyeonggi: Property[] = [];
  let incheon: Property[] = [];
  let lowDeposit: Property[] = [];
  let filteredProperties: Property[] = [];

  if (hasRegionFilter) {
    filteredProperties = await getByRegion(
      selectedCity,
      selectedDistrict || undefined,
      selectedNeighborhood || undefined,
    );
  } else {
    [seoul, gyeonggi, incheon, lowDeposit] = await Promise.all([
      getByCity("서울"),
      getByCity("경기"),
      getByCity("인천"),
      getLowDeposit(),
    ]);
  }

  const cityLabel = CITY_LABELS[selectedCity] || selectedCity;
  const regionHeading = [cityLabel, selectedDistrict]
    .filter(Boolean)
    .join(" ");

  const filteredTitle = selectedNeighborhood
    ? `${selectedNeighborhood} 매물정보`
    : selectedDistrict
      ? `${selectedDistrict} 매물정보`
      : `${cityLabel} 매물정보`;

  const districtBaseHref =
    selectedCity && selectedDistrict
      ? `/?city=${encodeURIComponent(
          selectedCity,
        )}&district=${encodeURIComponent(selectedDistrict)}`
      : "/";

  return (
    <>
      <div className="dy-desktop-header-only">
        <Header />
      </div>

      <section className="dy-mobile-home-top">
        <div className="dy-mobile-home-brand">
          <img src="/dy-logo-transparent.png" alt="DY다이아부동산" />
        </div>

        <nav className="dy-mobile-home-menu" aria-label="모바일 메인 메뉴">
          <Link href="/?city=서울">서울분양정보</Link>
          <Link href="/?city=경기">경기분양정보</Link>
          <Link href="/?city=인천">인천분양정보</Link>
          <Link href="/?feature=급매물">급매물분양</Link>
          <Link href="/inquiry">문의게시판</Link>
          <Link href="/reviews">고객후기</Link>
        </nav>
      </section>

      <MainBannerSlider />

      <section className="km-home-review-row">
        <div className="km-home-review-content">
          <ReviewsSection />
        </div>

        <div className="km-home-quick-consult">
          <QuickConsultCard />
        </div>
      </section>

      <main className="km-home-layout">
        <aside className="km-home-left-column">
          <LeftSidebar />
        </aside>

        <section className="km-home-center-column">
          <div className="km-home-search-wrap">
            <SearchPanel />
          </div>

          {hasRegionFilter ? (
            <>
              <section className="dy-region-location-panel">
                <h2>{regionHeading}</h2>

                {selectedDistrict && neighborhoods.length > 0 ? (
                  <nav
                    className="dy-neighborhood-grid"
                    aria-label={`${regionHeading} 동 선택`}
                  >
                    <Link
                      href={districtBaseHref}
                      className={
                        selectedNeighborhood ? "" : "is-active"
                      }
                    >
                      전체
                    </Link>

                    {neighborhoods.map((name) => (
                      <Link
                        key={name}
                        href={`${districtBaseHref}&neighborhood=${encodeURIComponent(
                          name,
                        )}`}
                        className={
                          selectedNeighborhood === name
                            ? "is-active"
                            : ""
                        }
                      >
                        {name}
                      </Link>
                    ))}
                  </nav>
                ) : null}
              </section>

              <PropertySection
                title={filteredTitle}
                city={selectedCity}
                properties={filteredProperties}
              />
            </>
          ) : (
            <>
              <PropertySection
                title="서울분양정보"
                city="서울"
                properties={seoul}
              />

              <PropertySection
                title="경기분양정보"
                city="경기"
                properties={gyeonggi}
              />

              <PropertySection
                title="인천분양정보"
                city="인천"
                properties={incheon}
              />

              <PropertySection
                title="낮은실입주금"
                properties={lowDeposit}
              />
            </>
          )}
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`

        .dy-mobile-home-top { display: none; }

        @media (max-width: 760px) {
          .dy-desktop-header-only { display: none !important; }

          .dy-mobile-home-top {
            display: block !important;
            width: 100%;
            background: #fff;
          }

          .dy-mobile-home-brand {
            min-height: 118px;
            padding: 14px 16px 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-bottom: 1px solid #dedede;
            background: #fff;
            box-sizing: border-box;
          }

          .dy-mobile-home-brand img {
            width: 225px;
            max-width: 72vw;
            height: 92px;
            object-fit: contain;
          }

          .dy-mobile-home-menu {
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            border-top: 1px solid #dedede;
            border-left: 1px solid #dedede;
            background: #fff;
          }

          .dy-mobile-home-menu a {
            min-width: 0;
            height: 57px;
            padding: 0 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-right: 1px solid #dedede;
            border-bottom: 1px solid #dedede;
            color: #111;
            font-size: 16px;
            font-weight: 800;
            letter-spacing: -0.7px;
            text-align: center;
            white-space: nowrap;
            box-sizing: border-box;
          }

          .km-home-review-row {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 18px 15px 20px !important;
            display: block !important;
            grid-template-columns: minmax(0, 1fr) !important;
            box-sizing: border-box !important;
          }

          .km-home-review-content {
            width: 100% !important;
            min-width: 0 !important;
            max-width: 100% !important;
          }

          .km-home-quick-consult { display: none !important; }

          .km-home-layout {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 15px 44px !important;
            display: block !important;
            box-sizing: border-box !important;
          }

          .km-home-left-column,
          .km-home-right-column {
            display: none !important;
          }

          .km-home-center-column,
          .km-home-search-wrap {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 0 !important;
          }

          .km-home-search-wrap { margin-top: 0 !important; }
          .dy-region-location-panel { margin-top: 18px !important; }
        }

        .dy-region-location-panel {
          margin: 18px 0 16px;
        }

        .dy-region-location-panel h2 {
          margin: 0 0 14px;
          color: #111;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: -1.2px;
        }

        .dy-neighborhood-grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          border-top: 1px solid #d8d8d8;
          border-left: 1px solid #d8d8d8;
        }

        .dy-neighborhood-grid a {
          min-height: 34px;
          padding: 7px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-right: 1px solid #d8d8d8;
          border-bottom: 1px solid #d8d8d8;
          background: #fff;
          color: #555;
          font-size: 12px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          box-sizing: border-box;
        }

        .dy-neighborhood-grid a:hover,
        .dy-neighborhood-grid a.is-active {
          background: #f6b51d;
          color: #fff;
        }

        @media (max-width: 760px) {
          .dy-region-location-panel h2 {
            font-size: 21px;
          }

          .dy-neighborhood-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
