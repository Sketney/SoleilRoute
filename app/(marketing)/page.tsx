import { FAQSection } from "@/components/marketing/faqs";
import { FeaturesGrid } from "@/components/marketing/features-grid";
import { HeroSection } from "@/components/marketing/hero-section";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { PricingPlans } from "@/components/marketing/pricing-plans";

export default function MarketingPage() {
  return (
    <>
      <HeroSection />
      <FeaturesGrid />
      <HowItWorks />
      <PricingPlans />
      <FAQSection />
    </>
  );
}
