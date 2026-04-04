"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import FillFormCar from "@/Details/Report/FillFormCar";

function FillFormContent() {
  const searchParams = useSearchParams();
  const carId = searchParams.get("id") || "";
  
  return <FillFormCar carId={carId} />;
}

export default function FillFormPage() {
  return (
    <main className="bg-[var(--background)] min-h-screen">
      <Suspense fallback={<div className="p-12 text-center text-lg font-black text-gray-400">Loading Report Form...</div>}>
        <FillFormContent />
      </Suspense>
    </main>
  );
}
