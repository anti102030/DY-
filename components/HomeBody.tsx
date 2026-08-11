import LeftSidebar from "@/components/LeftSidebar";
import RightSidebar from "@/components/RightSidebar";
import SearchPanel from "@/components/SearchPanel";
import PropertySection from "@/components/PropertySection";

type HomeBodyProps = {
  seoulProperties: any[];
  gyeonggiProperties: any[];
  incheonProperties: any[];
  lowDepositProperties: any[];
};

export default function HomeBody({
  seoulProperties,
  gyeonggiProperties,
  incheonProperties,
  lowDepositProperties,
}: HomeBodyProps) {
  return (
    <div className="page-layout">
      <LeftSidebar />

      <main>
        <form action="/listings" method="get">
          <SearchPanel />
        </form>

        <PropertySection
          title="서울분양정보"
          properties={seoulProperties}
        />

        <PropertySection
          title="경기분양정보"
          properties={gyeonggiProperties}
        />

        <PropertySection
          title="인천분양정보"
          properties={incheonProperties}
        />

        <PropertySection
          title="낮은실입주금"
          properties={lowDepositProperties}
        />
      </main>

      <RightSidebar />
    </div>
  );
}
