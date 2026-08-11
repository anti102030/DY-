import Link from "next/link";

type RegionBoxProps = {
  title: string;
  items: string[];
  symbol: string;
  city: "서울" | "경기" | "인천";
};

export default function RegionBox({
  title,
  items,
  symbol,
  city,
}: RegionBoxProps) {
  return (
    <section className="region-box">
      <h3>
        <span>{symbol}</span>
        {title}
      </h3>

      <div className="region-grid">
        {items.map((item) => (
          <Link
            key={item}
            href={`/listings?city=${encodeURIComponent(
              city
            )}&district=${encodeURIComponent(item)}`}
          >
            {item}
          </Link>
        ))}
      </div>
    </section>
  );
}
