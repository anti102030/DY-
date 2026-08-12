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
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getNeighborhoods } from "@/lib/regionNeighborhoods";
import type { PropertyRow } from "@/lib/propertyTypes";
import type { Property } from "@/lib/homeData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const HOME_LIMIT = 6;
const FILTER_LIMIT = 30;

type HomeSearchParams = {
  city?: string;
  district?: string;
  neighborhood?: string;
  deposit?: string;
  deposit_max?: string;
  property_type?: string;
  rooms_group?: string;
  feature?: string;
};

type PageSetting = {
  page_key: string;
  title: string | null;
  description: string | null;
  is_visible: boolean;
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
    address: row.address || "",
    city: row.city || "",
    district: row.district || "",
    neighborhood: row.neighborhood || "",
    price: row.price || "-",
    deposit: row.deposit || "-",
    loan: row.loan || "-",
    rooms: row.rooms,
    bathrooms: row.bathrooms,
    areaPyeong: row.area_pyeong,
    listingBadge: row.listing_badge || "신축분양",
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
    .limit(FILTER_LIMIT);

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

function parseKoreanMoney(value?: string | null): number | null {
  if (value === null || value === undefined) return null;

  const normalized = String(value)
    .replace(/,/g, "")
    .replace(/\s+/g, "")
    .trim();

  if (!normalized) return null;

  if (
    normalized === "0" ||
    normalized === "0원" ||
    normalized.includes("무입주금") ||
    normalized.includes("입주금없음")
  ) {
    return 0;
  }

  let total = 0;
  let matched = false;

  const eokMatch = normalized.match(/(\d+(?:\.\d+)?)억/);
  if (eokMatch) {
    total += Number(eokMatch[1]) * 10000;
    matched = true;
  }

  const manMatch = normalized.match(/(\d+(?:\.\d+)?)만/);
  if (manMatch) {
    total += Number(manMatch[1]);
    matched = true;
  }

  if (matched) return total;

  const plainNumber = normalized.match(/\d+(?:\.\d+)?/);
  if (!plainNumber) return null;

  return Number(plainNumber[0]);
}

function matchesPropertyType(
  row: PropertyRow,
  propertyType?: string,
): boolean {
  if (!propertyType) return true;

  const searchableText = [
    row.property_type,
    row.title,
    row.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchableText.includes(propertyType.toLowerCase());
}

function matchesFeature(
  row: PropertyRow,
  feature?: string,
): boolean {
  if (!feature) return true;

  const searchableText = [
    row.property_type,
    row.title,
    row.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (feature === "테라스복층") {
    return (
      searchableText.includes("테라스") ||
      searchableText.includes("복층")
    );
  }

  return searchableText.includes(feature.toLowerCase());
}

function matchesRoomGroup(
  row: PropertyRow,
  roomsGroup?: string,
): boolean {
  if (!roomsGroup) return true;

  const roomCount = Number(row.rooms);

  if (!Number.isFinite(roomCount)) return false;

  if (roomsGroup === "1-2") {
    return roomCount >= 1 && roomCount <= 2;
  }

  if (roomsGroup === "3-4") {
    return roomCount >= 3 && roomCount <= 4;
  }

  return true;
}

async function getBySideFilter({
  deposit,
  depositMax,
  propertyType,
  roomsGroup,
  feature,
}: {
  deposit?: string;
  depositMax?: string;
  propertyType?: string;
  roomsGroup?: string;
  feature?: string;
}): Promise<Property[]> {
  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "공개");

  if (feature === "급매물") {
    query = query.eq("is_urgent", true);
  }

  const { data, error } = await query
    .order("id", { ascending: false })
    .limit(300);

  if (error) {
    console.error("[홈 사이드 필터] 매물 불러오기 오류:", error);
    return [];
  }

  const depositMaximum = depositMax
    ? Number(depositMax)
    : null;

  const filteredRows = ((data ?? []) as PropertyRow[]).filter(
    (row) => {
      const depositAmount = parseKoreanMoney(row.deposit);

      if (deposit === "0" && depositAmount !== 0) {
        return false;
      }

      if (
        depositMaximum !== null &&
        (!Number.isFinite(depositAmount) ||
          depositAmount === null ||
          depositAmount > depositMaximum)
      ) {
        return false;
      }

      if (!matchesRoomGroup(row, roomsGroup)) {
        return false;
      }

      if (!matchesPropertyType(row, propertyType)) {
        return false;
      }

      if (
        feature !== "급매물" &&
        !matchesFeature(row, feature)
      ) {
        return false;
      }

      return true;
    },
  );

  return filteredRows.slice(0, FILTER_LIMIT).map(toProperty);
}

async function getPageSettings(): Promise<Record<string, PageSetting>> {
  const { data, error } = await supabaseAdmin
    .from("page_settings")
    .select("page_key, title, description, is_visible");

  if (error) {
    console.error(
      "[홈] page_settings 불러오기 실패:",
      error.message,
    );

    return {};
  }

  const settings = (data ?? []) as PageSetting[];

  console.log("[홈] page_settings:", settings);

  return Object.fromEntries(
    settings.map((item) => [
      item.page_key,
      item,
    ]),
  );
}

function pageTitle(
  settings: Record<string, PageSetting>,
  key: string,
  fallback: string,
) {
  return settings[key]?.title?.trim() || fallback;
}

function pageVisible(
  settings: Record<string, PageSetting>,
  key: string,
) {
  return settings[key]?.is_visible !== false;
}

export default async function Home({
  searchParams,
}: {
  searchParams?: Promise<HomeSearchParams>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : {};

  const pageSettings = await getPageSettings();

  const selectedCity = resolvedSearchParams.city?.trim() || "";
  const selectedDistrict = resolvedSearchParams.district?.trim() || "";
  const selectedNeighborhood =
    resolvedSearchParams.neighborhood?.trim() || "";

  const selectedDeposit =
    resolvedSearchParams.deposit?.trim() || "";
  const selectedDepositMax =
    resolvedSearchParams.deposit_max?.trim() || "";
  const selectedPropertyType =
    resolvedSearchParams.property_type?.trim() || "";
  const selectedRoomsGroup =
    resolvedSearchParams.rooms_group?.trim() || "";
  const selectedFeature =
    resolvedSearchParams.feature?.trim() || "";

  const hasRegionFilter = Boolean(selectedCity);
  const hasSideFilter = Boolean(
    selectedDeposit ||
      selectedDepositMax ||
      selectedPropertyType ||
      selectedRoomsGroup ||
      selectedFeature,
  );

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
  } else if (hasSideFilter) {
    filteredProperties = await getBySideFilter({
      deposit: selectedDeposit || undefined,
      depositMax: selectedDepositMax || undefined,
      propertyType: selectedPropertyType || undefined,
      roomsGroup: selectedRoomsGroup || undefined,
      feature: selectedFeature || undefined,
    });
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

  const districtBaseHref =
    selectedCity && selectedDistrict
      ? `/?city=${encodeURIComponent(
          selectedCity,
        )}&district=${encodeURIComponent(selectedDistrict)}`
      : "/";

  const seoulTitle = pageTitle(
    pageSettings,
    "seoul",
    "서울분양정보",
  );

  const gyeonggiTitle = pageTitle(
    pageSettings,
    "gyeonggi",
    "경기분양정보",
  );

  const incheonTitle = pageTitle(
    pageSettings,
    "incheon",
    "인천분양정보",
  );

  const urgentTitle = pageTitle(
    pageSettings,
    "urgent",
    "급매물분양",
  );

  const lowDepositTitle = pageTitle(
    pageSettings,
    "low_deposit",
    "낮은실입주금",
  );

  const selectedCityKey =
    selectedCity === "서울"
      ? "seoul"
      : selectedCity === "경기"
        ? "gyeonggi"
        : selectedCity === "인천"
          ? "incheon"
          : "";

  const regionDisplayTitle =
    !selectedDistrict && selectedCityKey
      ? pageTitle(
          pageSettings,
          selectedCityKey,
          regionHeading,
        )
      : regionHeading;

  const sideFilterTitle =
    selectedFeature === "급매물"
      ? urgentTitle
      : selectedDepositMax === "5000"
        ? lowDepositTitle
        : "매물정보";

  return (
    <>
      <Header />

      <MainBannerSlider />

      {pageVisible(pageSettings, "reviews") && (
        <section className="km-home-review-row">
          <div className="km-home-review-content">
            <ReviewsSection />
          </div>

          <div className="km-home-quick-consult">
            <QuickConsultCard />
          </div>
        </section>
      )}

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
                <h2>{regionDisplayTitle}</h2>

                {selectedDistrict && neighborhoods.length > 0 ? (
                  <nav
                    className="dy-neighborhood-grid"
                    aria-label={`${regionDisplayTitle} 동 선택`}
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
                title={regionDisplayTitle}
                properties={filteredProperties}
                variant="regional-list"
              />
            </>
          ) : hasSideFilter ? (
            <PropertySection
              title={sideFilterTitle}
              properties={filteredProperties}
              variant="regional-list"
            />
          ) : (
            <>
              {pageVisible(pageSettings, "seoul") && (
                <PropertySection
                  title={seoulTitle}
                  city="서울"
                  properties={seoul}
                />
              )}

              {pageVisible(pageSettings, "gyeonggi") && (
                <PropertySection
                  title={gyeonggiTitle}
                  city="경기"
                  properties={gyeonggi}
                />
              )}

              {pageVisible(pageSettings, "incheon") && (
                <PropertySection
                  title={incheonTitle}
                  city="인천"
                  properties={incheon}
                />
              )}

              {pageVisible(pageSettings, "low_deposit") && (
                <PropertySection
                  title={lowDepositTitle}
                  properties={lowDeposit}
                />
              )}
            </>
          )}
        </section>

        <aside className="km-home-right-column">
          <RightSidebar />
        </aside>
      </main>

      <Footer />

      <style>{`
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

          .km-home-review-row {
            width: calc(100% - 30px);
            max-width: calc(100% - 30px);
            margin-left: auto;
            margin-right: auto;
            display: block;
            grid-template-columns: 1fr;
          }

          .km-home-review-content {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }

          .km-home-quick-consult {
            display: none;
          }

          .km-home-layout {
            width: calc(100% - 30px);
            max-width: calc(100% - 30px);
            margin-left: auto;
            margin-right: auto;
            grid-template-columns: minmax(0, 1fr);
          }

          .km-home-center-column,
          .km-home-search-wrap {
            width: 100%;
            max-width: 100%;
            min-width: 0;
          }
        }
      `}</style>
    </>
  );
}
