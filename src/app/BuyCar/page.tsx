import React from 'react';
import UsedcarModels from '@/BuyCar/UsedcarModels';
import UploadFetch from '@/Admin/Upload/UploadFetch';
import SearchEngine from '@/Details/SearchEngine/SearchEngine';

export default function BuyCarPage() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="bg-[#f8fafc] pt-12 pb-2 relative z-20">
        <SearchEngine />
      </div>
      <UploadFetch />
      <UsedcarModels />
    </main>
  );
}
