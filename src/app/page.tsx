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
      <TestimonialsHome />
    </>
  );
}
