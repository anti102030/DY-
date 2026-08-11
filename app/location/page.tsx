import Footer from "@/components/Footer";
import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import LocationMap from "@/components/LocationMap";
import InnerPageTop from "@/components/InnerPageTop";

export const dynamic = "force-dynamic";

const address =
  "서울특별시 강서구 등촌동 526-26 1층 다이아부동산";

export default function LocationPage() {
  return (
    <>
      <InnerPageTop />

      <main className="km-detail-shell">
        <LeftSidebar />

        <section className="km-detail-main">
          <form
            action="/listings"
            method="get"
            style={{
              width: "100%",
              margin: "0 0 24px",
            }}
          >
            <SearchPanel />
          </form>

          <section style={pageStyle}>
            <h1 style={titleStyle}>오시는길</h1>

            <div style={mapWrapStyle}>
              <LocationMap />
            </div>

            <section style={contactSectionStyle}>
              <h2 style={contactTitleStyle}>주소/연락처</h2>

              <div style={contactLineStyle}>
                <strong>주소:</strong>
                <span>{address}</span>
              </div>

              <div style={contactLineStyle}>
                <strong>전화번호:</strong>
                <a href="tel:01084268616" style={contactLinkStyle}>
                  010-8426-8616
                </a>
              </div>

              <div style={contactLineStyle}>
                <strong>팩스번호:</strong>
                <span>추후 입력</span>
              </div>

              <div style={contactLineStyle}>
                <strong>이메일:</strong>
                <span>tjwodnr94@naver.com</span>
              </div>
            </section>
          </section>
        </section>

        <RightSidebar />
      </main>

      <Footer />
    </>
  );
}

const pageStyle: React.CSSProperties = {
  width: "100%",
  background: "#ffffff",
};

const titleStyle: React.CSSProperties = {
  margin: 0,
  padding: "0 0 18px",
  color: "#111111",
  fontSize: "29px",
  fontWeight: 900,
  letterSpacing: "-1px",
};

const mapWrapStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid #d7d7d7",
  background: "#ffffff",
  boxSizing: "border-box",
};

const contactSectionStyle: React.CSSProperties = {
  marginTop: "42px",
};

const contactTitleStyle: React.CSSProperties = {
  margin: "0 0 18px",
  paddingBottom: "14px",
  borderBottom: "1px solid #d8d8d8",
  color: "#222222",
  fontSize: "28px",
  fontWeight: 800,
  letterSpacing: "-1px",
};

const contactLineStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "4px",
  marginBottom: "13px",
  color: "#555555",
  fontSize: "14px",
  lineHeight: 1.6,
};

const contactLinkStyle: React.CSSProperties = {
  color: "#555555",
  textDecoration: "none",
};
