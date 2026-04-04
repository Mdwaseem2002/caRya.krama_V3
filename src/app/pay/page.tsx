import { Suspense } from "react";
import Pay from "../../Details/Pay/Pay";

export default function PayPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500 font-semibold">Loading checkout...</div>}>
      <Pay />
    </Suspense>
  );
}
