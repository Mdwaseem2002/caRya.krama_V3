import Hero from "@/Home/Hero";
import ValueProp from "@/Home/ValueProp";
import ShowCar from "@/Home/ShowCar";
import HowItWorks from "@/Home/HowItWorks";
import InspectedCar from "@/Home/InspectedCar";
import OurStory from "@/Home/OurStory";
import TestimonialsHome from "@/Testimonials/testimonialsHome";
import VisitorTracker from "@/components/VisitorTracker";
import TrustSections from "@/Details/Trust/TrustSections";
import SearchEngine from "@/Details/SearchEngine/SearchEngine";
import StatisticsSection from "@/Testimonials/StatisticsSection";

export default function Home() {
  return (
    <>
      <VisitorTracker />
      <Hero />
      <ValueProp />
      <ShowCar />
      <HowItWorks />
      <TrustSections />
      <InspectedCar />
      <OurStory />
      <div className="max-w-7xl mx-auto px-6 mb-20">
        <StatisticsSection />
      </div>
      <TestimonialsHome />
    </>
  );
}
