"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { hasPurchased } from "@/Admin/data/purchases";
import { cars } from "@/Home/Card";
import { getAllStoredCars } from "@/Admin/Upload/CarStorage";
import InspectionReportPDFView from "@/Admin/InspectionReports/InspectionReportPDFView";
import { InspectionReportData } from "@/Admin/InspectionReports/InspectionStorage";
import { ShieldAlert } from "lucide-react";

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');
  
  const [report, setReport] = useState<InspectionReportData | null>(null);
  const [carCoverImage, setCarCoverImage] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (!carId) {
        router.push('/BuyCar');
        return;
      }

      // Check if user has purchased the report (simulated)
      const isPaid = hasPurchased(carId);
      if (!isPaid) {
        // Redirect back to car details if not purchased
        router.push(`/details?id=${carId}`);
        return;
      }

      try {
        // Fetch Car Cover Image
        let uploadedCars: any[] = [];
        try {
          uploadedCars = await getAllStoredCars();
        } catch (e) {}
        
        const foundUploaded = uploadedCars.find((c: any) => c.id === carId);
        const foundStatic = cars.find((c: any) => c.id.toString() === carId.toString());
        const carData = foundUploaded || foundStatic || cars[0];
        
        const coverImage = carData?.media?.coverImage || carData?.image || (carData?.media?.images && carData?.media?.images[0]) || (carData?.images && carData?.images[0]) || "";
        setCarCoverImage(coverImage);

        // Fetch the report from the DB
        const res = await fetch(`/api/inspection-reports?carId=${carId}`);
        const data = await res.json();
        
        if (data.success && data.reports && data.reports.length > 0) {
          // Select the most recent report
          setReport(data.reports[0]);
        } else {
          setError("No official inspection report has been generated for this vehicle yet.");
        }
      } catch (e: any) {
        console.error("Failed to fetch report:", e);
        setError("Error fetching inspection report.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [carId, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0059A3] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-sm hover:animate-pulse">Loading Official Report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6">
         <div className="bg-white p-10 rounded-3xl shadow-lg flex flex-col items-center max-w-md text-center border border-slate-100">
            <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6">
              <ShieldAlert className="w-10 h-10 text-amber-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Report Not Ready</h2>
            <p className="text-slate-500 mb-8 font-medium">{error}</p>
            <button 
              onClick={() => router.back()}
              className="bg-[#0059A3] hover:bg-[#004a87] text-white px-8 py-3 rounded-xl font-bold transition-all w-full"
            >
              Go Back to Vehicle
            </button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-200 py-6 md:py-12">
      <InspectionReportPDFView 
        report={report} 
        carCoverImage={carCoverImage} 
        onClose={() => router.back()} 
      />
    </div>
  );
}

export default function CarReport() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-[#0059A3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
