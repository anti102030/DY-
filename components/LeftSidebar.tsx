import Link from "next/link";

const regions = [
  {
    city: "서울",
    label: "서울특별시",
    icon: "/km-seoul-mark.png",
    districts: [
      "강남구","강동구","강북구","강서구","관악구","광진구","구로구","금천구",
      "노원구","도봉구","동대문구","동작구","마포구","서대문구","서초구","성동구",
      "성북구","송파구","양천구","영등포구","용산구","은평구","종로구","중구","중랑구",
    ],
  },
  {
    city: "경기",
    label: "경기도",
    icon: "/km-gyeonggi-mark.png",
    districts: [
      "수원시","성남시","고양시","용인시","부천시","안산시","안양시","남양주시",
      "화성시","평택시","의정부시","시흥시","파주시","김포시","광명시","광주시",
      "군포시","하남시","오산시","양주시","이천시","구리시","안성시","포천시",
      "의왕시","여주시","동두천시","과천시","가평군","양평군","연천군",
    ],
  },
  {
    city: "인천",
    label: "인천광역시",
    icon: "/km-incheon-mark.png",
    districts: [
      "중구","동구","미추홀구","연수구","남동구","부평구","계양구","서구","강화군","옹진군",
    ],
  },
];

export default function LeftSidebar() {
  return (
    <aside className="km-left-sidebar">
      <section className="km-customer-center">
        <h2>고객상담센터</h2>
        <a href="tel:01075854574">010-8426-8616</a>
        <p>연중무휴 365일 24시간</p>
        <p>토/일/공휴일 투어가능!</p>
      </section>

      {regions.map((region) => (
        <section className="km-region-panel" key={region.city}>
          <Link
            href={`/?city=${encodeURIComponent(region.city)}`}
            className="km-region-title"
          >
            <img src={region.icon} alt="" aria-hidden="true" />
            {region.label}
          </Link>

          <div className="km-region-grid">
            {region.districts.map((name) => (
              <Link
                key={`${region.city}-${name}`}
                href={`/?city=${encodeURIComponent(
                  region.city,
                )}&district=${encodeURIComponent(name)}`}
              >
                {name}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </aside>
  );
}
