"use client";

import React, { useState, useEffect } from 'react';
import { cars, Car } from '../data/cars';
import { getReportByCarId, CarReportData } from '../data/reports';
import ReportForm from '../new/ReportForm';
import { LayoutDashboard, Car as CarIcon, FileText, CheckCircle2, Clock, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [report, setReport] = useState<CarReportData | undefined>(undefined);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center text-white p-4">
        <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mb-6 border border-red-500/20">
          <Lock size={40} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-black tracking-tight mb-2">Access Restricted</h2>
        <p className="text-white/40 text-xs font-black uppercase tracking-widest text-center max-w-xs leading-relaxed">
          This terminal is restricted to administrative personnel only. Your access attempt has been logged.
        </p>
      </div>
    );
  }

  useEffect(() => {
    if (selectedCar) {
      setReport(getReportByCarId(selectedCar.id));
    }
  }, [selectedCar]);

  return (
    <div className="min-h-screen bg-transparent p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header - Minimalist */}
        <div className="flex items-center gap-6 mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 transform rotate-3 flex-shrink-0">
            <LayoutDashboard size={32} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter">Command <span className="text-blue-500">Center</span></h1>
            <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">Module: Report Management v2.0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Car Selection Sidebar - Glassy */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] px-4">Asset Inventory</h2>
            <div className="space-y-4">
              {cars.map((car) => {
                const hasReport = getReportByCarId(car.id);
                const isSelected = selectedCar?.id === car.id;
                return (
                  <button
                    key={car.id}
                    onClick={() => setSelectedCar(car)}
                    className={`w-full p-6 rounded-[2.25rem] text-left transition-all duration-500 group relative overflow-hidden border ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-400 shadow-2xl shadow-blue-600/20' 
                        : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.05] backdrop-blur-xl'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-xl ${isSelected ? 'bg-white/20' : 'bg-white/5 border border-white/5'}`}>
                        <CarIcon size={20} className={isSelected ? 'text-white' : 'text-blue-400'} />
                      </div>
                      {hasReport?.isApproved ? (
                        <div className="flex items-center gap-1.5 bg-green-500/10 text-green-400 px-3 py-1 rounded-full border border-green-500/20">
                          <CheckCircle2 size={10} />
                          <span className="text-[8px] font-black uppercase tracking-widest">Synced</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-400 px-3 py-1 rounded-full border border-amber-500/20">
                          <Clock size={10} className="animate-pulse" />
                          <span className="text-[8px] font-black uppercase tracking-widest">Pending</span>
                        </div>
                      )}
                    </div>
                    <div className={`font-black tracking-tight text-lg ${isSelected ? 'text-white' : 'text-white/80'}`}>{car.name}</div>
                    <div className={`text-[9px] font-black uppercase tracking-widest mt-2 ${isSelected ? 'text-white/40' : 'text-white/20'}`}>{car.id}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Area - Focal Point */}
          <div className="lg:col-span-2">
            {selectedCar ? (
              <div className="rounded-[3rem] bg-white/[0.01] border border-white/5 overflow-hidden">
                <ReportForm 
                  car={selectedCar} 
                  existingReport={report} 
                  onSave={() => setReport(getReportByCarId(selectedCar.id))} 
                />
              </div>
            ) : (
              <div className="h-full min-h-[500px] bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center group">
                <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mb-8 relative">
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-blue-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FileText size={40} className="text-white/20 group-hover:text-blue-400 transition-colors relative z-10" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight mb-3">Initialize Analysis</h3>
                <p className="text-white/30 text-[11px] font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed">
                  Select an asset unit from the Inventory sidebar to deploy the inspection protocol.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
