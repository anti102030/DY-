import Link from "next/link";
import { notFound } from "next/navigation";
import SearchPanel from "@/components/SearchPanel";
import DetailGallery from "@/components/DetailGallery";
import DetailConsultForm from "@/components/DetailConsultForm";
import PrintButton from "@/components/PrintButton";
import RecentViewedTracker from "@/components/RecentViewedTracker";
import ConsultationTicker from "@/components/ConsultationTicker";
import LiveDateTime from "@/components/LiveDateTime";
import PublicPageFrame from "@/components/PublicPageFrame";
import NoImagePlaceholder from "@/components/NoImagePlaceholder";
import { supabase } from "@/lib/supabase";
import type { PropertyRow } from "@/lib/propertyTypes";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ConsultationRow = {
  id: number;
  phone: string | null;
  region: string | null;
  created_at: string | null;
};

const NO_IMAGE_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
      <rect width="1200" height="800" fill="#f3f3f3"/>
      <text
        x="600"
        y="400"
        text-anchor="middle"
        dominant-baseline="middle"
        fill="#888888"
        font-family="Arial, sans-serif"
        font-size="52"
        font-weight="700"
      >
        사진 준비중
      </text>
    </svg>
  `);


function isRealThumbnail(value?: string | null) {
  const image = (value || "").trim();
  if (!image) return false;

  const normalized = image.toLowerCase();
  if (normalized.startsWith("data:image/svg+xml")) return false;
  if (normalized.includes("/images/no-image.png")) return false;
  if (normalized.includes("/images/property-placeholder")) return false;

  return true;
}

function formatDate(value?: string) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .format(new Date(value))
    .replaceAll(". ", "-")
    .replace(".", "");
}


function maskPhone(value?: string | null) {
  if (!value) return "010-XXXX-XXXX";

  const digits = value.replace(/\D/g, "");

  if (digits.length >= 11) {
    return `${digits.slice(0, 3)}-XXXX-${digits.slice(-4)}`;
  }

  return "010-XXXX-XXXX";
}

function QuickBellIcon() {
  return (
    <svg
      className="km-detail-alert-bell-svg"
      viewBox="0 0 120 120"
      aria-hidden="true"
    >
      <path
        d="M34 77V49c0-18 11-31 26-31s26 13 26 31v28l10 12H24l10-12Z"
        fill="none"
        stroke="#444"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M50 91c2 8 7 12 10 12s8-4 10-12"
        fill="none"
        stroke="#444"
        strokeWidth="7"
        strokeLinecap="round"
      />

      <path
        d="M83 22c8 5 13 12 15 21"
        fill="none"
        stroke="#f28c20"
        strokeWidth="6"
        strokeLinecap="round"
      />

      <path
        d="M91 14c11 7 18 17 21 30"
        fill="none"
        stroke="#f28c20"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}


function RelatedBellIcon() {
  return (
    <svg
      className="km-related-alert-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        fill="currentColor"
        d="M12 22a2.55 2.55 0 0 0 2.45-1.8h-4.9A2.55 2.55 0 0 0 12 22Zm7-5.4-1.65-2.02V9.5a5.35 5.35 0 0 0-4.35-5.26V3.5a1 1 0 1 0-2 0v.74A5.35 5.35 0 0 0 6.65 9.5v5.08L5 16.6a1 1 0 0 0 .77 1.64h12.46A1 1 0 0 0 19 16.6Z"
      />
    </svg>
  );
}

function InfoRow({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
}: {
  leftLabel: string;
  leftValue: React.ReactNode;
  rightLabel: string;
  rightValue: React.ReactNode;
}) {
  return (
    <div className="km-detail-info-row">
      <strong>{leftLabel}</strong>
      <span>{leftValue || "-"}</span>
      <strong>{rightLabel}</strong>
      <span>{rightValue || "-"}</span>
    </div>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error || !data) {
    notFound();
  }

  const property = data as PropertyRow;

  const { data: relatedData } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "공개")
    .neq("id", property.id)
    .order("id", { ascending: false })
    .limit(10);

  const relatedProperties = (relatedData ?? []) as PropertyRow[];

  const { data: consultationData } = await supabase
    .from("consultations")
    .select("id, phone, region, created_at")
    .order("id", { ascending: false })
    .limit(20);

  const recentConsultations = (consultationData ?? []) as ConsultationRow[];

  const { count: completedConsultationCount } = await supabase
    .from("consultations")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("status", "완료");

  const propertyImages = [
    property.thumbnail_url,
    ...(property.image_urls ?? []),
  ].filter((url): url is string => Boolean(url && url.trim()));

  const images =
    propertyImages.length > 0 ? propertyImages : [NO_IMAGE_PLACEHOLDER];

  const confirmedDate = formatDate(property.created_at);

  const addressText = [property.city, property.district, property.neighborhood]
    .filter(Boolean)
    .join(" ");

  const tickerConsultations = recentConsultations.map((item) => ({
    id: item.id,
    phone: maskPhone(item.phone),
    region: item.region?.trim() || addressText || "수도권",
  }));

  return (
    <PublicPageFrame>
          <div className="km-detail-search-wrap">
            <SearchPanel />
          </div>

          <div className="km-detail-view-heading">
            <h2>보기</h2>
          </div>

          <section className="km-detail-property-heading">
            <span className="km-detail-property-number">
              매물번호 <b>{property.id}</b>
            </span>

            <h1>{property.title}</h1>

          </section>

          <div className="km-detail-notice">
            <span>DY다이아부동산은</span>
            <b>신축 분양 전문회사</b>
            <span>입니다.</span>
            <strong>전세 / 월세</strong>
            <span>취급하지 않습니다.</span>
          </div>

          <div className="km-detail-top-grid">
            <DetailGallery images={images} title={property.title} />

            <div className="km-detail-side-stack">
              <aside className="km-detail-summary-card">
              <div className="km-detail-summary-title">
                <img src="/dy-logo-transparent.png" alt="" />

                <strong>분양정보 안내</strong>
              </div>

              <div className="km-detail-price-section">
                <strong className="km-detail-price-heading">가격</strong>

                <div className="km-detail-price-box">
                  <div>
                    <span className="km-chip km-chip-blue">분양가</span>

                    <b>{property.price || "-"}</b>
                  </div>

                  <div>
                    <span className="km-chip km-chip-pink">입주금</span>

                    <b>{property.deposit || "-"}</b>
                  </div>

                  <div>
                    <span className="km-chip km-chip-green">융자금</span>

                    <b>{property.loan || "-"}</b>
                  </div>
                </div>
              </div>

              <div className="km-detail-summary-row">
                <strong>면적</strong>

                <span>
                  {property.area_pyeong ? `${property.area_pyeong}평형` : "-"}
                </span>
              </div>

              <div className="km-detail-summary-row">
                <strong>방수</strong>

                <span>
                  방 {property.rooms}개 / 욕실 {property.bathrooms}개
                </span>
              </div>

              <div className="km-detail-manager-title">
                <img src="/dy-logo-transparent.png" alt="" />

                <div>
                  <strong>담당자정보 안내</strong>

                  <small>친절한 상담 도와드리겠습니다.</small>
                </div>
              </div>

              <div className="km-detail-summary-row">
                <strong>담당자</strong>
                <span>DY다이아부동산</span>
              </div>

              <div className="km-detail-summary-row">
                <strong>안심번호</strong>

                <a href="tel:01075854574">010-7585-4574</a>
              </div>

              </aside>

              <div className="km-detail-alert-box km-detail-alert-standalone">
                <strong>알림 신청</strong>

                <QuickBellIcon />

                <p>
                  확인하신 매물과 조건이 같은 매물이 나오면 문자로 안내드립니다.
                </p>
              </div>
            </div>
          </div>

          <section className="dy-km-status-board">
            <div className="dy-km-status-left">
              <div className="dy-km-confirmed-box">
                <b className="dy-km-confirmed-text">
                  [{confirmedDate} <span>확인매물</span>
                  입니다.]
                </b>
              </div>

              <div className="dy-km-live-box">
                <span className="dy-km-live-badge">LIVE</span>

                <b className="dy-km-confirmed-text"><LiveDateTime /> 기준</b>

                <strong className="dy-km-completed-count">
                  <span className="dy-km-completed-number">
                    {(completedConsultationCount ?? 0).toLocaleString()}명
                  </span>

                  <span className="dy-km-completed-label">상담완료</span>
                </strong>
              </div>
            </div>

            <ConsultationTicker
              items={tickerConsultations}
              fallbackRegion={addressText || "수도권"}
            />
          </section>

          <DetailConsultForm
            propertyId={property.id}
            source="상세페이지 상단 상담신청"
          />

          <section className="km-detail-info-section">
            <h2>
              <span>DY</span> 기본정보
            </h2>

            <div className="km-detail-info-table">
              <InfoRow
                leftLabel="소재지"
                leftValue={property.address}
                rightLabel="주차대수"
                rightValue="-"
              />

              <InfoRow
                leftLabel="분양"
                leftValue={property.price}
                rightLabel="입주금"
                rightValue={property.deposit}
              />

              <InfoRow
                leftLabel="방/욕실"
                leftValue={`방 ${property.rooms}개 / 욕실 ${property.bathrooms}개`}
                rightLabel="면적정보"
                rightValue={
                  property.area_pyeong ? `${property.area_pyeong}평` : "-"
                }
              />

              <InfoRow
                leftLabel="층정보"
                leftValue={property.floor}
                rightLabel="엘리베이터"
                rightValue="-"
              />

              <InfoRow
                leftLabel="방향"
                leftValue={property.direction}
                rightLabel="관리비"
                rightValue={property.maintenance_fee}
              />

              <InfoRow
                leftLabel="베란다/발코니"
                leftValue="-"
                rightLabel="빌트인"
                rightValue="-"
              />

              <InfoRow
                leftLabel="입주가능일"
                leftValue={property.move_in_status}
                rightLabel="세대수"
                rightValue="-"
              />

              <InfoRow
                leftLabel="편의시설"
                leftValue="-"
                rightLabel="교육시설"
                rightValue="-"
              />

              <InfoRow
                leftLabel="인근지하철"
                leftValue="-"
                rightLabel="역과의거리"
                rightValue="-"
              />
            </div>
          </section>

          {/* DY 안심분양 안내 이미지 */}
          <section
            className="km-detail-guide-image km-detail-guide-safe"
            aria-label="DY다이아부동산 안심분양 안내"
          >
            <img
              src="/images/dy-safe.png"
              alt="DY다이아부동산 안심분양 안내"
              width={900}
              height={900}
              loading="lazy"
            />
          </section>

          {/* 전국은행 담보대출 안내 이미지 */}
          <section
            className="km-detail-guide-image km-detail-guide-loan"
            aria-label="전국은행 담보대출 안내"
          >
            <img
              src="/images/dy-loan-guide.png"
              alt="업계 최대 전국은행 담보대출 통합서비스 안내"
              width={779}
              height={579}
              loading="lazy"
            />
          </section>

          <section className="km-detail-contact-table">
            <h2>담당자정보</h2>

            <div>
              <strong>담당자</strong>
              <span>DY다이아부동산</span>

              <strong>안심번호</strong>

              <a href="tel:01075854574">010-7585-4574</a>

              <strong>이메일</strong>
              <span>-</span>

              <strong>매물번호</strong>

              <span>
                [{property.id}] {addressText}
              </span>
            </div>
          </section>

          <DetailConsultForm
            propertyId={property.id}
            source="상세페이지 하단 상담신청"
            compact
          />

          <div className="km-detail-bottom-buttons">
            <a href="tel:01075854574">빠른상담신청</a>

            <PrintButton />

            <Link href="/listings">최근 본 매물</Link>
          </div>

          <section className="km-related-section">
            <div className="km-related-list">
              {relatedProperties.map((item) => (
                <article className="km-related-item" key={item.id}>
                  <Link
                    href={`/listings/${item.id}`}
                    className="km-related-thumb"
                  >
                    {isRealThumbnail(item.thumbnail_url) ? (
                      <span className="dy-related-watermark-wrap">
                        <img
                          src={item.thumbnail_url!}
                          alt={item.title}
                        />

                        <span className="dy-related-watermark-box">
                          <img
                            src="/dy-watermark.png"
                            alt=""
                            aria-hidden="true"
                            draggable={false}
                          />
                        </span>
                      </span>
                    ) : (
                      <NoImagePlaceholder />
                    )}
                  </Link>

                  <div className="km-related-content">
                    <div className="km-related-badges">
                      <b className="dy-related-safe-badge">안심인증</b>
                      <b className="dy-related-confirm-badge">
                        {formatDate(item.created_at)} 확인
                      </b>
                      <b className="dy-related-new-badge">
                        {item.listing_badge || "신축분양"}
                      </b>
                      <b className="dy-related-alert-badge">
                        <RelatedBellIcon />
                        알림
                      </b>
                    </div>

                    <p className="km-related-number">
                      [매물번호 {item.id}] {item.city} {item.district}{" "}
                      {item.neighborhood}
                    </p>

                    <Link href={`/listings/${item.id}`}>
                      <h3>{item.title}</h3>
                    </Link>

                    <div className="km-related-summary">
                      <span>
                        {item.area_pyeong ? `${item.area_pyeong}평` : "면적문의"}
                        {item.area_pyeong ? (
                          <em>({(item.area_pyeong * 3.3058).toFixed(0)}㎡)</em>
                        ) : null}
                      </span>
                      <i>|</i>
                      <span>방{item.rooms}욕실{item.bathrooms}</span>
                      <i>|</i>
                      <span>주차대수 문의</span>
                    </div>

                    <div className="km-related-subway">
                      지하철 <strong>정보문의</strong>
                    </div>

                    <div className="km-related-price">
                      <span>분양가</span>
                      <b>{item.price || "문의"}</b>

                      <span>입주금</span>
                      <b>{item.deposit || "문의"}</b>

                      <span>융자금</span>
                      <b>{item.loan || "문의"}</b>
                    </div>
                  </div>

                  <aside>
                    <strong>DY다이아부동산</strong>

                    <a href="tel:01075854574">010-7585-4574</a>

                  </aside>
                </article>
              ))}
            </div>
          </section>
    
      <style>{`
        .km-related-thumb {
          position: relative;
          overflow: hidden;
        }

        .dy-related-watermark-wrap {
          position: relative;
          display: block;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .dy-related-watermark-wrap > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .dy-related-watermark-box {
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;

          width: 250px !important;
          height: 250px !important;

          max-width: 38% !important;
          max-height: 60% !important;

          display: flex !important;
          align-items: center !important;
          justify-content: center !important;

          overflow: visible !important;

          opacity: 0.3 !important;

          pointer-events: none !important;
          user-select: none !important;

          z-index: 4 !important;
        }

        .dy-related-watermark-box > img {
          display: block !important;

          width: 100% !important;
          height: 100% !important;

          max-width: 100% !important;
          max-height: 100% !important;

          object-fit: contain !important;

          margin: 0 !important;
          padding: 0 !important;
        }

        @media (max-width: 760px) {
          .dy-related-watermark-box {
            width: 120px !important;
            height: 120px !important;

            max-width: 26% !important;
            max-height: 42% !important;

            opacity: 0.34 !important;
          }
        }
      `}</style>

    </PublicPageFrame>
  );
}
