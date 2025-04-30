import Hero from "@/components/Hero";
import NewsCarousel from "@/components/NewsCarousel";
import HighlightedSection from "@/components/HighlightedSection";
import Ad from "@/components/Ad";
import { AfricaMap } from "@/components/AfricaMap";
import FeaturedNews from "@/components/FeaturedNews";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import TrustedBy from "@/components/TrustedBy";
export default function Home() {
  return (
    <>
      <Hero />
      <NewsCarousel />
      <HighlightedSection />
      <PremiumFeaturesSection />
      <AfricaMap />
      <TrustedBy />
      <FeaturedNews />
      {/* <Ad src="/images/screenshot--47--2.png" /> */}
      {/* <Ad src="/images//screenshot--46--2.png" />s */}
    </>
  );
}
