import Header from "@/components/Header";
import MainBannerSlider from "@/components/MainBannerSlider";
import ReviewsSection from "@/components/ReviewsSection";
import QuickConsultCard from "@/components/QuickConsultCard";

type InnerPageTopProps = {
  bannerControls?: boolean;
};

export default function InnerPageTop({
  bannerControls = true,
}: InnerPageTopProps) {
  return (
    <>
      <Header />

      <MainBannerSlider showControls={bannerControls} />

      <section className="km-home-review-row" aria-label="고객후기 및 빠른 상담">
        <div className="km-home-review-content">
          <ReviewsSection />
        </div>
        <div className="km-home-quick-consult">
          <QuickConsultCard />
        </div>
      </section>
    </>
  );
}
