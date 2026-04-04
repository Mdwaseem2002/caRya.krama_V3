import React from 'react';
import UsedcarModels from '@/BuyCar/UsedcarModels';
import UsedCar from '@/BuyCar/UsedCar';
import UploadFetch from '@/Admin/Upload/UploadFetch';
import SearchEngine from '@/Details/SearchEngine/SearchEngine';

export default function BuyCarPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="bg-[#f8fafc] py-12 relative z-20">
        <SearchEngine />
      </div>
      <UploadFetch />
      <UsedcarModels />
      <UsedCar />
    </main>
  );
}
