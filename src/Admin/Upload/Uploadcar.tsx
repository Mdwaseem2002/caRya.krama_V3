import React, { useState, useRef, useEffect } from "react";
import { Upload, X, Image as ImageIcon, Star, CheckCircle, Save, Send, ArrowLeft, ChevronDown, ClipboardCheck, FileUp, FileText as FileTextIcon } from "lucide-react";
import { saveCarToStorage, updateCarInStorage, StoredCar } from "./CarStorage";
import InspectionReportForm from "../InspectionReports/InspectionReportForm";
import InspectionReportUpload from "../InspectionReports/InspectionReportUpload";


// Custom Select Component for Sleek UI
const CustomSelect = ({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', zIndex: isOpen ? 100 : 1 }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', 
          backgroundColor: 'white', display: 'flex', justifyContent: 'space-between', 
          alignItems: 'center', cursor: 'pointer', boxSizing: 'border-box',
          transition: 'all 0.2s', borderColor: isOpen ? '#0059A3' : '#d1d5db'
        }}
      >
        <span style={{ color: value ? '#111827' : '#9ca3af', fontSize: '14px', fontWeight: value ? 600 : 400 }}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#6b7280' }} />
      </div>

      {isOpen && (
        <div style={{ 
          position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '4px', 
          backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', 
          zIndex: 100, overflow: 'hidden', padding: '4px'
        }}>
          {options.map((opt) => (
            <div 
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              style={{ 
                padding: '10px 12px', cursor: 'pointer', fontSize: '14px', borderRadius: '8px',
                backgroundColor: value === opt ? '#f0f9ff' : 'transparent',
                color: value === opt ? '#0059A3' : '#374151',
                fontWeight: value === opt ? 700 : 500,
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                if (value !== opt) e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                if (value !== opt) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


interface UploadcarProps {
  onBack: () => void;
  onSuccess: () => void;
  editCar?: StoredCar;
}

export default function Uploadcar({ onBack, onSuccess, editCar }: UploadcarProps) {
  const [title, setTitle] = useState(editCar?.title || "");
  const [brand, setBrand] = useState(editCar?.brand || "");
  const [model, setModel] = useState(editCar?.model || "");
  const [year, setYear] = useState(editCar?.year || "");
  const [generatedCarId] = useState(() => editCar?.id || `CK-${Math.floor(Math.random() * 10000000)}`);

  const [images, setImages] = useState<string[]>(editCar?.media.images || []);
  const [coverImage, setCoverImage] = useState<string | null>(editCar?.media.coverImage || null);

  const [actualPrice, setActualPrice] = useState(editCar?.pricing.actualPrice || "");
  const [sellingPrice, setSellingPrice] = useState(editCar?.pricing.sellingPrice || "");

  const [mileage, setMileage] = useState(editCar?.specs.mileage || "");
  const [fuelType, setFuelType] = useState(editCar?.specs.fuelType || "");
  const [transmission, setTransmission] = useState(editCar?.specs.transmission || "");
  const [ownership, setOwnership] = useState(editCar?.specs.ownership || "");
  const [color, setColor] = useState(editCar?.specs.color || "");
  const [warranty, setWarranty] = useState(editCar?.specs.warranty || false);

  const [serviceHistory, setServiceHistory] = useState<string[]>(editCar?.condition.serviceHistory || []);
  const [historyInput, setHistoryInput] = useState("");

  const [sellerName, setSellerName] = useState(editCar?.sellerDetails.name || "caRya.krama Verified");
  const [sellerType, setSellerType] = useState(editCar?.sellerDetails.type || "Professional");
  const [sellerMemberSince, setSellerMemberSince] = useState(editCar?.sellerDetails.memberSince || "2024");

  const [conditionLabel, setConditionLabel] = useState(editCar?.condition.conditionLabel || "Excellent");
  const [score, setScore] = useState(editCar?.condition.score || "9.8");
  const [highlights, setHighlights] = useState<string[]>(editCar?.condition.highlights || []);
  const [highlightInput, setHighlightInput] = useState("");
  
  const [inspectionPoints, setInspectionPoints] = useState<{ title: string; value: string; highlight?: boolean }[]>(editCar?.condition.inspectionPoints || []);
  const [insTitle, setInsTitle] = useState("");
  const [insValue, setInsValue] = useState("");
  const [insHighlight, setInsHighlight] = useState(false);

  const [area, setArea] = useState(editCar?.location.area || "");
  const [city, setCity] = useState(editCar?.location.city || "Bangalore");

  const [tags, setTags] = useState<string[]>(editCar?.tags || ["New Arrival"]);

  // Inspection Report
  const [inspectionMode, setInspectionMode] = useState<"none" | "create" | "upload">("none");
  const [inspectionSaved, setInspectionSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          const MAX_WIDTH = 1600;
          const scale = Math.min(1, MAX_WIDTH / img.width);
          const canvas = document.createElement("canvas");
          canvas.width = img.width * scale;
          canvas.height = img.height * scale;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas not supported");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // 0.85 quality = ~85% quality JPEG for high fidelity
          resolve(canvas.toDataURL("image/jpeg", 0.85));
        };
        img.onerror = reject;
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      try {
        const compressed = await compressImage(file);
        setImages((prev) => {
          const newImages = [...prev, compressed];
          if (!coverImage) setCoverImage(compressed);
          return newImages;
        });
        if (!coverImage) setCoverImage(await compressImage(file));
      } catch (err) {
        console.error("Image compression failed:", err);
      }
    }
  };

  const calculateSavings = () => {
    const a = parseFloat(actualPrice.replace(/[^0-9.]/g, ''));
    const s = parseFloat(sellingPrice.replace(/[^0-9.]/g, ''));
    if (!isNaN(a) && !isNaN(s) && a > s) {
      return `Save ₹${(a - s).toFixed(2)} Lakh`;
    }
    return null;
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const handleAddHistory = () => {
    if (historyInput.trim() && !serviceHistory.includes(historyInput.trim())) {
      setServiceHistory([...serviceHistory, historyInput.trim()]);
      setHistoryInput("");
    }
  };

  const handleAddInspectionPoint = () => {
    if (insTitle.trim() && insValue.trim()) {
      setInspectionPoints([...inspectionPoints, { title: insTitle, value: insValue, highlight: insHighlight }]);
      setInsTitle("");
      setInsValue("");
      setInsHighlight(false);
    }
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (status: 'draft' | 'published') => {
    if (!title || !brand || !sellingPrice || images.length === 0) {
      alert("Please fill in basic info, pricing, and upload at least one media file.");
      return;
    }

    setIsSaving(true);
    try {
      const carPayload = {
        id: generatedCarId,
        title, brand, model, year,
        media: { images, coverImage: coverImage || images[0] },
        pricing: { actualPrice, sellingPrice, savings: calculateSavings() || "" },
        specs: { mileage, fuelType, transmission, ownership, color, warranty },
        condition: { conditionLabel, score, highlights, inspectionPoints, serviceHistory },
        sellerDetails: { name: sellerName, type: sellerType, memberSince: sellerMemberSince },
        location: { area, city },
        tags,
        status
      };

      if (editCar) {
        await updateCarInStorage(editCar.id, carPayload);
      } else {
        await saveCarToStorage(carPayload);
      }

      onSuccess();
    } catch (err: any) {
      alert(`Failed to save car: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#0059A3', fontWeight: 700, cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
        <ArrowLeft size={16} /> Back to Inventory
      </button>

      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '32px' }}>{editCar ? 'Edit Car Details' : 'Upload New Car'}</h2>

      {/* 1. Basic Info */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>1. Basic Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Car Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Infiniti QX60 Autograph" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Brand</label>
            <input value={brand} onChange={e => setBrand(e.target.value)} placeholder="Infiniti" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Model</label>
            <input value={model} onChange={e => setModel(e.target.value)} placeholder="QX60" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Year</label>
            <input value={year} onChange={e => setYear(e.target.value)} placeholder="2022" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* 2. Car Media */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>2. Car Media</h3>
        <div 
          onClick={() => fileInputRef.current?.click()}
          style={{ width: '100%', padding: '40px 20px', border: '2px dashed #d1d5db', borderRadius: '12px', textAlign: 'center', backgroundColor: '#f9fafb', cursor: 'pointer', marginBottom: '16px' }}
        >
          <Upload size={32} style={{ color: '#9ca3af', margin: '0 auto 12px' }} />
          <p style={{ fontWeight: 600, color: '#4b5563', margin: '0 0 4px' }}>Click or Drag & Drop to upload images</p>
          <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>(Upload up to 20 high quality images)</p>
          <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
        </div>
        
        {images.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px', padding: '4px' }}>
            {images.map((img, idx) => {
              const isCover = coverImage === img;
              return (
                <div 
                  key={idx} 
                  onClick={() => setCoverImage(img)}
                  style={{ 
                    position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden', 
                    cursor: 'pointer', border: isCover ? '3px solid #0059A3' : '1px solid #e5e7eb',
                    transition: 'all 0.2s', transform: isCover ? 'scale(1.05)' : 'scale(1)',
                    boxShadow: isCover ? '0 10px 15px -3px rgba(0, 89, 163, 0.2)' : 'none',
                    zIndex: isCover ? 10 : 1
                  }}
                >
                  <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isCover ? 1 : 0.8 }} className="hover:opacity-100 transition-opacity" />
                  
                  {/* Selection Indicator */}
                  {isCover ? (
                    <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#0059A3', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                      <Star size={10} fill="white" /> COVER
                    </div>
                  ) : (
                    <div className="set-cover-hint" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', opacity: 0, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                       <span style={{ color: 'white', fontSize: '9px', fontWeight: 800, textAlign: 'center', width: '100%' }}>SET AS COVER</span>
                    </div>
                  )}

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setImages(images.filter((_, i) => i !== idx));
                      if (isCover) setCoverImage(null);
                    }} 
                    style={{ position: 'absolute', top: '6px', right: '6px', padding: '4px', background: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', color: '#EF4444', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                  ><X size={12} /></button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Pricing */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>3. Pricing</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Actual Price</label>
            <input value={actualPrice} onChange={e => setActualPrice(e.target.value)} placeholder="₹46.50 Lakh" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Selling Price</label>
            <input value={sellingPrice} onChange={e => setSellingPrice(e.target.value)} placeholder="₹45.99 Lakh" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        {calculateSavings() && (
          <p style={{ marginTop: '12px', fontSize: '13px', fontWeight: 700, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}><CheckCircle size={14} /> Auto Calculated: {calculateSavings()}</p>
        )}
      </section>

      {/* 4. Specifications */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>4. Specifications</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Mileage (KM)</label>
            <input value={mileage} onChange={e => setMileage(e.target.value)} placeholder="e.g. 15,000 km" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Fuel Type</label>
            <CustomSelect 
              value={fuelType} 
              onChange={setFuelType} 
              options={["Petrol", "Diesel", "Electric", "Hybrid"]} 
              placeholder="Select..." 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Transmission</label>
            <CustomSelect 
              value={transmission} 
              onChange={setTransmission} 
              options={["Automatic", "Manual"]} 
              placeholder="Select..." 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '8px' }}>Add 1st owner / 2nd owner / 3rd owner field</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {["1st Owner", "2nd Owner", "3rd Owner"].map((type) => (
                <button
                  key={type}
                  onClick={() => setOwnership(type)}
                  style={{
                    flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid',
                    fontSize: '12px', fontWeight: 800, cursor: 'pointer', transition: 'all 0.2s',
                    backgroundColor: ownership === type ? '#0059A3' : 'white',
                    color: ownership === type ? 'white' : '#374151',
                    borderColor: ownership === type ? '#0059A3' : '#d1d5db'
                  }}
                >{type}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Color</label>
            <input value={color} onChange={e => setColor(e.target.value)} placeholder="Mojave Desert" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <input type="checkbox" checked={warranty} onChange={e => setWarranty(e.target.checked)} id="warrantyCheck" style={{ width: '18px', height: '18px' }} />
            <label htmlFor="warrantyCheck" style={{ fontSize: '14px', fontWeight: 700, color: '#374151', cursor: 'pointer' }}>Warranty Included</label>
          </div>
        </div>
      </section>

      {/* 5. Condition & Highlights */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>5. Condition & Highlights</h3>
        {/* Condition Score fields removed */}
        
        <div style={{ marginBottom: '24px' }}>
           <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Service History Log</label>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input value={historyInput} onChange={e => setHistoryInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddHistory(); }} placeholder="e.g. Major service at 45k km - Authorized Center" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={handleAddHistory} style={{ padding: '0 24px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Add log</button>
           </div>
           <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {serviceHistory.map((h, i) => (
                <span key={i} style={{ padding: '6px 12px', backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '12px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {h}
                  <button onClick={() => setServiceHistory(serviceHistory.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#047857', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                </span>
              ))}
           </div>
        </div>
        
        <div>
           <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Add Highlights</label>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input value={highlightInput} onChange={e => setHighlightInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') handleAddHighlight(); }} placeholder="Like New" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={handleAddHighlight} style={{ padding: '0 24px', backgroundColor: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
           </div>
           <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {highlights.map((h, i) => (
                <span key={i} style={{ padding: '6px 12px', backgroundColor: '#e0f2fe', color: '#0369a1', borderRadius: '50px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {h}
                  <button onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#0369a1', cursor: 'pointer', padding: 0 }}><X size={12} /></button>
                </span>
              ))}
           </div>
        </div>
      </section>

      {/* 7. Inspection Summary */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>7. Inspection Summary</h3>
        {/* Overall Inspection Score display removed */}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
           <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '8px' }}>Add Inspection Points (e.g. Engine, Brakes)</label>
           <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input value={insTitle} onChange={e => setInsTitle(e.target.value)} placeholder="Point Title (e.g. Engine)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <input value={insValue} onChange={e => setInsValue(e.target.value)} placeholder="Value (e.g. Perfect)" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '0 8px' }}>
                <input type="checkbox" checked={insHighlight} onChange={e => setInsHighlight(e.target.checked)} id="insHighlight" />
                <label htmlFor="insHighlight" style={{ fontSize: '12px', fontWeight: 600, color: '#4b5563' }}>Highlt</label>
              </div>
              <button onClick={handleAddInspectionPoint} style={{ padding: '12px 20px', backgroundColor: '#0059A3', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>Add</button>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {inspectionPoints.map((point, i) => (
                <div key={i} style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', 
                  backgroundColor: point.highlight ? '#fff7ed' : '#f9fafb', 
                  border: point.highlight ? '1px solid #fed7aa' : '1px solid #e5e7eb', 
                  borderRadius: '10px' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle size={14} style={{ color: '#10B981' }} />
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{point.title}: </span>
                      <span style={{ fontSize: '14px', fontWeight: 500, color: point.highlight ? '#c2410c' : '#4b5563' }}>{point.value}</span>
                    </div>
                  </div>
                  <button onClick={() => setInspectionPoints(inspectionPoints.filter((_, idx) => idx !== i))} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><X size={16} /></button>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* 8. Seller Details */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>8. Seller Info</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Seller Name</label>
            <input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="caRya.krama" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Seller Type</label>
            <CustomSelect 
              value={sellerType} 
              onChange={setSellerType} 
              options={["Professional", "Individual", "Verified Partner"]} 
              placeholder="Select..." 
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Member Since</label>
            <input value={sellerMemberSince} onChange={e => setSellerMemberSince(e.target.value)} placeholder="2024" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* 9. Location */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px' }}>9. Location</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Area</label>
            <input value={area} onChange={e => setArea(e.target.value)} placeholder="Indiranagar" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>City</label>
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Bangalore" style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
      </section>

      {/* 10. Vehicle Inspection Report */}
      <section style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#374151', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ClipboardCheck size={18} style={{ color: '#0059A3' }} /> 10. Vehicle Inspection Report
        </h3>

        {inspectionSaved ? (
          <div style={{ padding: '20px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <CheckCircle size={20} style={{ color: '#16a34a' }} />
            <div>
              <p style={{ fontWeight: 700, color: '#166534', margin: '0 0 2px', fontSize: '14px' }}>Inspection report saved successfully!</p>
              <p style={{ color: '#6b7280', margin: 0, fontSize: '12px' }}>The report will be linked to this vehicle after publishing.</p>
            </div>
          </div>
        ) : inspectionMode === "none" ? (
          <div style={{ display: 'flex', gap: '16px' }}>
            <button
              onClick={() => setInspectionMode("create")}
              style={{
                flex: 1, padding: '24px', borderRadius: '14px', border: '2px dashed #d1d5db',
                backgroundColor: '#f9fafb', cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0059A3'; e.currentTarget.style.backgroundColor = '#f0f9ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
            >
              <ClipboardCheck size={28} style={{ color: '#0059A3' }} />
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>Create Report</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>Fill the structured inspection form</span>
            </button>
            <button
              onClick={() => setInspectionMode("upload")}
              style={{
                flex: 1, padding: '24px', borderRadius: '14px', border: '2px dashed #d1d5db',
                backgroundColor: '#f9fafb', cursor: 'pointer', textAlign: 'center',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '10px'
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#0059A3'; e.currentTarget.style.backgroundColor = '#f0f9ff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.backgroundColor = '#f9fafb'; }}
            >
              <FileUp size={28} style={{ color: '#0059A3' }} />
              <span style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>Upload Report</span>
              <span style={{ fontSize: '12px', color: '#6b7280' }}>PDF, Excel, or Word document</span>
            </button>
          </div>
        ) : inspectionMode === "create" ? (
          <InspectionReportForm
            onBack={() => setInspectionMode("none")}
            onSuccess={() => { setInspectionSaved(true); setInspectionMode("none"); }}
            carId={generatedCarId}
            carName={title || brand}
            year={year}
            odometer={mileage}
          />
        ) : (
          <InspectionReportUpload
            onBack={() => setInspectionMode("none")}
            onSuccess={() => { setInspectionSaved(true); setInspectionMode("none"); }}
            carId={generatedCarId}
            carName={title || brand}
          />
        )}
      </section>

      {/* Fixed Bottom Action Bar */}
      <div style={{ 
        position: 'sticky', bottom: 0, padding: '20px 0', borderTop: '1px solid #e5e7eb', backgroundColor: 'white',
        display: 'flex', justifyContent: 'flex-start', gap: '16px', zIndex: 10
      }}>
        <button 
          onClick={() => handleSubmit('draft')}
          disabled={isSaving}
          style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '12px', fontWeight: 700, border: '1px solid #d1d5db', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: isSaving ? 0.7 : 1 }}
        >
          <Save size={18} /> {isSaving ? 'Saving...' : 'Save Draft'}
        </button>
        <button 
          onClick={() => handleSubmit('published')}
          disabled={isSaving}
          style={{ padding: '12px 32px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: isSaving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0, 89, 163, 0.3)', opacity: isSaving ? 0.7 : 1 }}
        >
          <Send size={18} /> {isSaving ? 'Publishing...' : 'Publish Car'}
        </button>
      </div>

    </div>
  );
}
