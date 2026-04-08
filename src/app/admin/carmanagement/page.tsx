"use client";

import React, { useState, useEffect } from "react";
import Uploadcar from "@/Admin/Upload/Uploadcar";
import { getAllStoredCars, deleteCarFromStorage, StoredCar } from "@/Admin/Upload/CarStorage";
import { Plus, Edit3, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function CarManagementPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const mobile = useIsMobile();
  const [showUpload, setShowUpload] = useState(searchParams.get('action') === 'upload');
  const [editingCar, setEditingCar] = useState<StoredCar | undefined>(undefined);
  const [cars, setCars] = useState<StoredCar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCars = () => {
    setIsLoading(true);
    getAllStoredCars()
      .then(setCars)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (!showUpload) {
      fetchCars();
    }
  }, [showUpload]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCarFromStorage(id);
        fetchCars();
      } catch (err: any) {
        alert(`Failed to delete car: ${err?.message || 'Unknown error'}`);
      }
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {showUpload ? (
          <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <Uploadcar 
              onBack={() => { setShowUpload(false); setEditingCar(undefined); router.replace('/admin/carmanagement'); }} 
              onSuccess={() => { setShowUpload(false); setEditingCar(undefined); router.replace('/admin/carmanagement'); fetchCars(); }} 
              editCar={editingCar} 
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>
              <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Asset Inventory</h2>
              <button onClick={() => setShowUpload(true)} style={{ padding: '8px 16px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                <Plus size={16} /> Upload
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {isLoading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>Loading assets...</div>
              ) : cars.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #d1d5db', color: '#6b7280' }}>
                  No cars uploaded yet. Click "Upload" to add your first car.
                </div>
              ) : (
                cars.map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
                    <img src={item.media.coverImage} alt={item.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{item.title}</h4>
                      <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{item.id} • <span style={{ color: '#0059A3', fontWeight: 600 }}>{item.pricing.sellingPrice}</span></p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => { setEditingCar(item); setShowUpload(true); }} style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#6b7280', cursor: 'pointer' }}><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
