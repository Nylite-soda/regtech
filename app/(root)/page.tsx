import Hero from "@/components/Hero";
import NewsCarousel from "@/components/NewsCarousel";
import HighlightedSection from "@/components/HighlightedSection";
import Ad from "@/components/Ad";
import { AfricaMap } from "@/components/AfricaMap";
import FeaturedNews from "@/components/FeaturedNews";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
export default function Home() {
  return (
    <>
      <Hero />
      <NewsCarousel />
      <HighlightedSection />
      <AfricaMap />
      <Ad src="/images/screenshot--47--2.png" />
      <FeaturedNews />
      <Ad src="/images//screenshot--46--2.png" />
      <div className="mt-4 p-4 md:p-6 md: mx-auto max-w-5xl">
        <h2 className="text-[#AD0000] text-2xl text-center md:text-4xl font-bold mb-[300px]">
          Trusted by notable organizations worldwide
        </h2>
      </div>
      <PremiumFeaturesSection />
    </>
  );
}
