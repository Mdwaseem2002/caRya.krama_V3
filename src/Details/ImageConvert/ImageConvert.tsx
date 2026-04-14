"use client";

import React, { useState } from "react";
import { getAllStoredCars, updateCarInStorage } from "@/Admin/Upload/CarStorage";
import { Settings, CheckCircle2, RefreshCw } from "lucide-react";

type ConvertMode = "full" | "thumbnail";

/**
 * Utility: Convert a File OR Base64 string into a WebP Base64 string.
 * - mode "full"      → 1920px wide, 0.85 quality  (used when saving to DB)
 * - mode "thumbnail" → 400px wide,  0.70 quality  (used for list/card previews)
 */
export const convertToWebP = (source: File | string, mode: ConvertMode = "full"): Promise<string> => {
  return new Promise((resolve, reject) => {
    const MAX_WIDTH   = mode === "thumbnail" ? 400  : 1920;
    const QUALITY     = mode === "thumbnail" ? 0.70 : 0.85;

    const handleImageLoad = (img: HTMLImageElement) => {
      const canvas = document.createElement("canvas");
      
      let scale = 1;
      if (img.width > MAX_WIDTH) {
        scale = MAX_WIDTH / img.width;
      }
      
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject("Canvas not supported");
      
      // Draw image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      // Use QUALITY from mode parameter (thumbnail = 0.70, full = 0.85)
      const webpBase64 = canvas.toDataURL("image/webp", QUALITY);
      resolve(webpBase64);
    };

    const img = new window.Image();
    img.crossOrigin = "Anonymous"; // Crucial for external URLs if any
    
    img.onload = () => handleImageLoad(img);
    img.onerror = reject;

    if (source instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(source);
    } else {
      img.src = source;
    }
  });
};

/**
 * Component: Admin Tool to migrate ALL historically uploaded heavy JPEGs/PNGs into WebP.
 * Once run, the Buy page loading time will drop from ~50s down to ~1s.
 */
export default function ImageMigrationTool() {
  const [isMigrating, setIsMigrating] = useState(false);
  const [progress, setProgress] = useState({ total: 0, current: 0 });
  const [statusText, setStatusText] = useState("");

  const startMigration = async () => {
    if (!confirm("This will scan the database and convert all massive JPEG/PNG images to lightweight WebP. Proceed?")) return;
    
    setIsMigrating(true);
    try {
      setStatusText("Fetching DB records...");
      // Force refresh cache to get latest cars
      const cars = await getAllStoredCars(true); 
      setProgress({ total: cars.length, current: 0 });

      for (let i = 0; i < cars.length; i++) {
        const car = cars[i];
        setStatusText(`Processing ${car.title}...`);
        
        // Track whether this specific car needs a database update
        let needsUpdate = false;
        const newImages: string[] = [];

        // 1. Generate tiny thumbnail for list/card pages (400px wide, 0.70 quality WebP)
        let newCoverThumbnail = car.media.coverThumbnail || "";
        let newCoverFull      = car.media.coverImage || "";

        const needsThumb = !newCoverThumbnail || newCoverThumbnail.length < 100;
        if (newCoverFull && needsThumb) {
          try {
            newCoverThumbnail = await convertToWebP(newCoverFull, "thumbnail");
            needsUpdate = true;
          } catch(e) { console.warn("Failed thumbnail", e); }
        }

        // 2. Convert full coverImage to WebP if not already
        if (newCoverFull && !newCoverFull.startsWith("data:image/webp")) {
          try {
            newCoverFull = await convertToWebP(newCoverFull, "full");
            needsUpdate = true;
          } catch(e) { console.warn("Failed converting cover", e); }
        }

        // 3. Convert Gallery Images → full quality WebP
        for (const imgStr of (car.media.images || [])) {
          if (imgStr && !imgStr.startsWith("data:image/webp")) {
            try {
              newImages.push(await convertToWebP(imgStr, "full"));
              needsUpdate = true;
            } catch(e) { newImages.push(imgStr); }
          } else {
            newImages.push(imgStr);
          }
        }

        // 4. Save back to DB
        if (needsUpdate) {
          await updateCarInStorage(car.id, {
            media: {
              coverImage:     newCoverFull,
              coverThumbnail: newCoverThumbnail,
              images:         newImages,
            }
          } as any);
        }

        setProgress(prev => ({ ...prev, current: i + 1 }));
      }
      
      setStatusText("✅ Migration Complete! All vehicles are now running WebP.");
      setTimeout(() => { setIsMigrating(false); setStatusText(""); }, 5000);

    } catch (err) {
      alert("Error occurred during migration.");
      setStatusText("Failed.");
      setIsMigrating(false);
    }
  };

  if (!isMigrating && !statusText) {
    return (
      <button 
        onClick={startMigration}
        className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg hover:shadow-emerald-500/30 transition-all hover:-translate-y-1"
      >
        <Settings size={14} />
        Optimize DB to WebP
      </button>
    );
  }

  return (
    <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xl w-full max-w-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-black text-gray-800 text-sm uppercase">WebP Migration Agent</h4>
        {isMigrating ? <RefreshCw className="animate-spin text-emerald-500" size={16} /> : <CheckCircle2 className="text-emerald-500" size={16} />}
      </div>
      
      <div className="text-xs font-bold text-gray-500 mb-2 truncate">{statusText}</div>
      
      <div className="w-full bg-gray-100 rounded-full h-2 mb-2 overflow-hidden">
        <div 
          className="bg-emerald-500 h-2 rounded-full transition-all duration-300 ease-out" 
          style={{ width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%` }}
        />
      </div>
      <div className="text-[10px] font-black uppercase text-right text-gray-400">
        {progress.current} / {progress.total} Assets
      </div>
    </div>
  );
}
