import CarDetails from "@/Home/Cardetails/CarDetails";
import VisitorTracker from "@/components/VisitorTracker";

// Force static rendering parameter if needed, but here it's fine as dynamic or static
export default function CarPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen pt-[70px] md:pt-[90px]" style={{ background: "var(--background)" }}>
      <VisitorTracker />
      <CarDetails id={params.id} />
    </main>
  );
}
