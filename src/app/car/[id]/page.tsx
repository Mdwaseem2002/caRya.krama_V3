import CarDetails from "@/Home/Cardetails/CarDetails";
import VisitorTracker from "@/components/VisitorTracker";
import { getCarForInitialRender } from "@/lib/carServerCache";

export default async function CarPage({ params }: { params: { id: string } }) {
  // Ultra-fast in-memory server lookup (<1ms) for instant SSR rendering
  const initialCar = await getCarForInitialRender(params.id);

  return (
    <main className="min-h-screen pt-[70px] md:pt-[90px]" style={{ background: "var(--background)" }}>
      <VisitorTracker />
      <CarDetails id={params.id} initialCar={initialCar} />
    </main>
  );
}
