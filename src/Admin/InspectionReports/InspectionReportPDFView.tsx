"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useRef } from "react";
import { Download, CheckCircle2, AlertTriangle, ShieldCheck, Car as CarIcon, Settings, Droplets, Battery, MapPin, Mail, Globe, Phone } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import { InspectionReportData } from "./InspectionStorage";
import InspectionReportDownload, { InspectionReportDownloadHandle } from "./InspectionReportDownload";
import { LOGO_BASE64 } from "./logoBase64";

interface InspectionReportPDFViewProps {
  report: InspectionReportData;
  carCoverImage?: string;
  onClose: () => void;
}

const isWarning = (text: string) => {
  const lText = text?.toLowerCase() || "";
  if (lText.includes("no fault") || lText.includes("none detected") || lText.includes("no issue") || lText.includes("no observation")) return false;
  return lText.includes("need") || lText.includes("leak") || lText.includes("damage") || lText.includes("fault") || lText.includes("issue") || lText.includes("replace") || lText.includes("bad") || lText.includes("attention");
};

export default function InspectionReportPDFView({ report, carCoverImage, onClose }: InspectionReportPDFViewProps) {
  const downloadRef = useRef<InspectionReportDownloadHandle>(null);
  const mobile = useIsMobile();

  const handleDownloadPDF = async () => {
    if (downloadRef.current) {
      await downloadRef.current.handleDownloadPDF();
    }
  };

  const hasProblemImages = report.inspectionImages && report.inspectionImages.length > 0;
  const problemImages: any[] = hasProblemImages ? (report.inspectionImages as any[]) : [];
  
  // If 1 or 2 problem images, they fit on Page 4 below Section 9.
  // If 3 or more images, Page 4 holds Sections 8 & 9, and separate gallery pages hold the images (up to 4 per page).
  const imagesOnPage4 = problemImages.length <= 2 ? problemImages : [];
  const separateImagePages = problemImages.length > 2 
    ? Array.from({ length: Math.ceil(problemImages.length / 4) }, (_, i) => problemImages.slice(i * 4, i * 4 + 4))
    : [];

  const totalPages = 4 + separateImagePages.length;

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: mobile ? '16px 12px' : '40px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* Interactive Action Bar */}
      <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', alignItems: mobile ? 'stretch' : 'center', justifyContent: 'space-between', marginBottom: '24px', width: '100%', maxWidth: '794px', backgroundColor: '#ffffff', padding: mobile ? '12px' : '16px 24px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', gap: mobile ? '10px' : '0' }}>
        <button onClick={onClose} style={{ width: mobile ? '100%' : 'auto', padding: mobile ? '12px' : '10px 20px', backgroundColor: '#f3f4f6', color: '#111827', borderRadius: '8px', fontWeight: 700, border: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: mobile ? 'center' : 'flex-start', gap: '8px', transition: 'all 0.2s ease', fontSize: mobile ? '13px' : '14px' }}>
          ← Back
        </button>
        <button onClick={handleDownloadPDF} style={{ width: mobile ? '100%' : 'auto', padding: mobile ? '12px' : '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: mobile ? 'center' : 'flex-start', gap: '8px', boxShadow: '0 4px 10px rgba(0, 89, 163, 0.3)', transition: 'all 0.2s ease', fontSize: mobile ? '13px' : '14px' }}>
          <Download size={18} /> Download Official PDF
        </button>
      </div>

      {/* High-Quality Download Template (Rendered Off-Screen for Capture) */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <InspectionReportDownload 
          ref={downloadRef}
          initialReport={report} 
          carCoverImage={carCoverImage} 
        />
      </div>

      {/* ── PDF Container Pages (Preview) ────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '20px' : '36px', width: '100%', maxWidth: '794px' }}>
        
        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 1: EXECUTIVE OVERVIEW & CERTIFIED VEHICLE SUMMARY
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '20px 14px' : '40px 50px 30px 50px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
            
            {/* BRAND HEADER — Logo + Contact */}
            <div style={{ 
              display: 'flex', 
              flexDirection: mobile ? 'column' : 'row',
              border: '2px solid #0059A3', 
              borderRadius: '12px',
              padding: mobile ? '14px' : '18px 20px',
              marginBottom: '18px',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
              width: '100%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              gap: mobile ? '14px' : '0'
            }}>
              <div style={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                paddingRight: mobile ? '0' : '20px',
                borderRight: mobile ? 'none' : '1px solid #e5e7eb',
                borderBottom: mobile ? '1px solid #e5e7eb' : 'none',
                paddingBottom: mobile ? '12px' : '0'
              }}>
                <div style={{ width: '220px', height: '65px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <img 
                    src={LOGO_BASE64} 
                    alt="caRya.krama Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} 
                  />
                </div>
                <p style={{ margin: 0, fontSize: mobile ? '8.5px' : '9.5px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Professional Vehicle Inspection Services</p>
              </div>
              
              <div style={{ 
                flex: 1, 
                paddingLeft: mobile ? '0' : '24px',
                paddingTop: mobile ? '12px' : '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}>
                <table style={{ borderCollapse: 'collapse', width: '100%', border: 'none' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '28px', paddingBottom: '10px', verticalAlign: 'middle' }}>
                        <Mail size={15} style={{ color: '#0059A3', display: 'block' }} />
                      </td>
                      <td style={{ paddingBottom: '10px', verticalAlign: 'middle', fontSize: mobile ? '12.5px' : '13.5px', fontWeight: 600, color: '#374151' }}>
                        caryakrama@gmail.com
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: '28px', paddingBottom: '10px', verticalAlign: 'middle' }}>
                        <Globe size={15} style={{ color: '#0059A3', display: 'block' }} />
                      </td>
                      <td style={{ paddingBottom: '10px', verticalAlign: 'middle', fontSize: mobile ? '12.5px' : '13.5px', fontWeight: 600, color: '#374151' }}>
                        https://caryakrama.com/
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: '28px', verticalAlign: 'middle' }}>
                        <Phone size={15} style={{ color: '#0059A3', display: 'block' }} />
                      </td>
                      <td style={{ verticalAlign: 'middle', fontSize: mobile ? '12.5px' : '13.5px', fontWeight: 600, color: '#374151' }}>
                        +91 99001 87847
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{ width: '100%', height: '2px', backgroundColor: '#0059A3', marginBottom: '16px' }}></div>
            
            {/* INSPECTION META BAR */}
            <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: mobile ? '10px 8px' : '14px 16px', marginBottom: '18px' }}>
              <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e5e7eb' }}>
                 <p style={{ margin: '0 0 4px 0', fontSize: mobile ? '8.5px' : '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</p>
                 <p style={{ margin: 0, fontSize: mobile ? '11px' : '14px', fontWeight: 800, color: '#111827' }}>{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e5e7eb' }}>
                 <p style={{ margin: '0 0 4px 0', fontSize: mobile ? '8.5px' : '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection ID</p>
                 <p style={{ margin: 0, fontSize: mobile ? '11px' : '14px', fontWeight: 800, color: '#0059A3' }}>{report.id}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                 <p style={{ margin: '0 0 2px 0', fontSize: mobile ? '8.5px' : '10px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspector</p>
                 <p style={{ margin: 0, fontSize: mobile ? '11px' : '14px', fontWeight: 800, color: '#111827' }}>{(report as any).inspectorName || "Z.K."}</p>
              </div>
            </div>

            {/* VEHICLE OVERVIEW CARD */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: mobile ? '14px' : '18px 20px', backgroundColor: '#ffffff', marginBottom: '14px' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '14px' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <div style={{ backgroundColor: '#f0f9ff', padding: '6px', borderRadius: '6px' }}><CarIcon size={18} style={{ color: '#0059A3' }} /></div>
                   <h3 style={{ margin: 0, fontSize: mobile ? '14px' : '15px', fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Vehicle Overview</h3>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 12px', border: '1px solid #a7f3d0', borderRadius: '20px', fontSize: '10.5px', fontWeight: 700 }}>
                   <ShieldCheck size={14} /> Verified Badge
                 </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1fr 1fr 1fr', gap: mobile ? '14px 10px' : '16px 20px' }}>
                  <div>
                    <p style={labelStyle}>Make & Model</p>
                    <p style={valueStyle}>{report.vehicleDetails.carName}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Year / Model</p>
                    <p style={valueStyle}>{report.vehicleDetails.year || "-"}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Odometer</p>
                    <p style={valueStyle}>{report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Seller Name</p>
                    <p style={{ ...valueStyle, color: '#374151' }}>{report.sellerDetails?.name || "caRya.krama"}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Contact Number</p>
                    <p style={{ ...valueStyle, color: '#374151' }}>{report.sellerDetails?.contactNumber || "N/A"}</p>
                  </div>
                  <div>
                    <p style={labelStyle}>Location</p>
                    <p style={{ ...valueStyle, color: '#374151' }}>{(report.sellerDetails as any)?.location || "Bangalore, IN"}</p>
                  </div>
               </div>
            </div>

            {/* OVERALL VERDICT & EVALUATION CARD */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: mobile ? '14px' : '18px 20px', backgroundColor: '#ffffff', marginBottom: '14px' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '10px', marginBottom: '14px' }}>
                 <div style={{ backgroundColor: '#f0f9ff', padding: '6px', borderRadius: '6px' }}><ShieldCheck size={18} style={{ color: '#0059A3' }} /></div>
                 <h3 style={{ margin: 0, fontSize: mobile ? '14px' : '15px', fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Overall Inspection Verdict & Evaluation</h3>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                  <div style={{ borderLeft: '5px solid #0059A3', backgroundColor: '#f0f9ff', padding: '12px 16px', borderRadius: '0 10px 10px 0', border: '1px solid #e0f2fe', borderLeftWidth: '5px' }}>
                     <p style={{ margin: '0 0 4px 0', fontSize: '11.5px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tyre Condition & Wear Status</p>
                     <p style={{ margin: 0, fontSize: '14px', color: '#0369a1', fontWeight: 600, lineHeight: '1.45' }}>{report.verdict?.mechanicalCondition || "Satisfactory"}</p>
                  </div>
                  <div style={{ borderLeft: '5px solid #059669', backgroundColor: '#ecfdf5', padding: '12px 16px', borderRadius: '0 10px 10px 0', border: '1px solid #a7f3d0', borderLeftWidth: '5px' }}>
                     <p style={{ margin: '0 0 4px 0', fontSize: '11.5px', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purchase Recommendation</p>
                     <p style={{ margin: 0, fontSize: '15px', color: '#047857', fontWeight: 800, lineHeight: '1.45' }}>{report.verdict?.purchaseRecommendation || "Recommended"}</p>
                  </div>
               </div>

               {/* Official Certification Seal */}
               <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                 <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0059A3', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 900, flexShrink: 0 }}>✓</div>
                 <div>
                   <p style={{ margin: 0, fontSize: '11.5px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certified caRya.krama Vehicle Inspection</p>
                   <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.45 }}>Multi-point digital inspection and physical diagnostic verification completed by certified automotive engineers.</p>
                 </div>
               </div>
            </div>

          </div>
          <Footer pageNum={1} totalPages={totalPages} mobile={mobile} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 2: EXTERIOR, BODY & MECHANICAL INSPECTION
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '20px 14px' : '40px 50px 30px 50px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
             <h2 style={{ margin: '0 0 16px 0', fontSize: mobile ? '16px' : '19px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '12px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '6px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>EXTERIOR & MECHANICAL INSPECTION</span>
                <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id}</span>
             </h2>

             {/* 1. BODY & VISUAL INSPECTION */}
             <SectionCard icon={<MapPin size={20} />} title="1. BODY & VISUAL INSPECTION" mobile={mobile}>
                <PanelsGrid text={report.bodyInspection?.panelsChecked || "No observation"} mobile={mobile} />
                {report.bodyInspection?.notes && (
                  <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                    <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection Notes</p>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                      {report.bodyInspection.notes}
                    </p>
                  </div>
                )}
             </SectionCard>

             {/* 2. ENGINE BAY */}
             <SectionCard icon={<Settings size={20} />} title="2. ENGINE BAY" mobile={mobile}>
               <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                 {report.engineBay || "No observations reported during engine bay inspection."}
               </p>
             </SectionCard>

             {/* 3. FLUIDS TABLE */}
             <SectionCard icon={<Droplets size={20} />} title="3. FLUIDS DEGRADATION" mobile={mobile}>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '8px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', textAlign: 'left' }}>
                        <th style={{ padding: '9px 12px', borderBottom: '2px solid #e5e7eb', fontWeight: 800 }}>Fluid Type</th>
                        <th style={{ padding: '9px 12px', borderBottom: '2px solid #e5e7eb', fontWeight: 800 }}>Status</th>
                        <th style={{ padding: '9px 12px', borderBottom: '2px solid #e5e7eb', fontWeight: 800 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                       <FluidRow label="Engine Oil" status={report.fluids?.engineOil} warning={isWarning(report.fluids?.engineOil)} action={report.fluids?.serviceNotes || "-"} />
                       <FluidRow label="Coolant / Antifreeze" status={report.fluids?.coolant} warning={isWarning(report.fluids?.coolant)} action={report.fluids?.serviceNotes || "-"} />
                       <FluidRow label="Brake Fluid" status={report.fluids?.brakeOil} warning={isWarning(report.fluids?.brakeOil)} action={report.fluids?.serviceNotes || "-"} />
                    </tbody>
                  </table>
                </div>
             </SectionCard>
          </div>
          <Footer pageNum={2} totalPages={totalPages} mobile={mobile} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 3: DIAGNOSTICS, CABIN & ROAD TEST EVALUATION
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '20px 14px' : '40px 50px 30px 50px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
             <h2 style={{ margin: '0 0 16px 0', fontSize: mobile ? '16px' : '19px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '12px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '6px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>DIAGNOSTICS & ROAD TEST EVALUATION</span>
                <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id}</span>
             </h2>

             {/* 4. BATTERY & ELECTRICAL */}
             <SectionCard icon={<Battery size={20} />} title="4. BATTERY & ELECTRICAL" mobile={mobile}>
                 <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px', marginTop: '4px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Ignition</p>
                       <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#111827' }}>{report.battery?.ignitionVoltage || "-"}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Cranking</p>
                       <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#111827' }}>{report.battery?.crankingVoltage || "-"}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Charging</p>
                       <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#111827' }}>{report.battery?.chargingVoltage || "-"}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 3px 0', fontSize: '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Load Range</p>
                       <p style={{ margin: 0, fontSize: '16px', fontWeight: 900, color: '#111827' }}>{report.battery?.loadRange || "-"}</p>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: report.battery?.systemWorking ? '#ecfdf5' : '#fef2f2', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${report.battery?.systemWorking ? '#a7f3d0' : '#fecaca'}`, marginTop: '12px' }}>
                    <CheckCircle2 size={18} color={report.battery?.systemWorking ? "#059669" : "#dc2626"} />
                    <div>
                      <p style={{ margin: '0 0 2px 0', fontSize: '10px', color: report.battery?.systemWorking ? '#059669' : '#dc2626', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>System Health</p>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: report.battery?.systemWorking ? '#047857' : '#b91c1c' }}>{report.battery?.systemWorking ? "Battery & alternator charging system working properly" : "Charging system requires attention"}</p>
                    </div>
                 </div>
             </SectionCard>

             {/* 5. INTERIORS & CABIN */}
             {report.interiors?.condition && (
             <SectionCard icon={<CarIcon size={20} />} title="5. INTERIORS & CABIN" mobile={mobile}>
               <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                 {report.interiors.condition}
               </p>
             </SectionCard>
             )}

             {/* 6. TEST DRIVE OBSERVATIONS */}
             {report.testDrive && (
             <SectionCard icon={<CarIcon size={20} />} title="6. TEST DRIVE OBSERVATIONS" mobile={mobile}>
                 <div>
                   <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Driving Performance</p>
                   <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                      {report.testDrive.performance || "Not evaluated"}
                   </p>
                 </div>
                 {report.testDrive.observations && (
                   <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid #e5e7eb' }}>
                        <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Transmission & Suspension</p>
                        <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                           {report.testDrive.observations}
                        </p>
                   </div>
                 )}
             </SectionCard>
             )}

             {/* IMPORTANT ISSUES REQUIRING ATTENTION */}
             {report.interiors?.issues && (
             <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '10px', padding: '14px 18px', marginBottom: '12px' }}>
               <h3 style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <AlertTriangle size={16} style={{ color: '#ef4444' }} /> Important Issues Requiring Attention
               </h3>
               <p style={{ margin: 0, fontSize: '12.5px', color: '#991b1b', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                 {report.interiors.issues}
               </p>
             </div>
             )}
          </div>
          <Footer pageNum={3} totalPages={totalPages} mobile={mobile} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 4: ACTIONABLE RECOMMENDATIONS & VEHICLE EVIDENCE
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '20px 14px' : '40px 50px 30px 50px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
             <h2 style={{ margin: '0 0 16px 0', fontSize: mobile ? '16px' : '19px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '12px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '6px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>ACTIONABLE RECOMMENDATIONS & EVIDENCE</span>
                <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id}</span>
             </h2>

             {/* 8. PRECAUTIONS & RECOMMENDATIONS */}
             <SectionCard icon={<AlertTriangle size={20} />} title="8. PRECAUTIONS & RECOMMENDATIONS" mobile={mobile}>
                <BulletList text={report.precautions || "No generic precautions indicated."} warning={true} forceBullet={true} />
             </SectionCard>

             {/* 9. SERVICE RECOMMENDATIONS */}
             {(report.serviceRecommendations && report.serviceRecommendations !== "-") && (
             <SectionCard icon={<Settings size={20} />} title="9. SERVICE RECOMMENDATIONS" mobile={mobile}>
                <BulletList text={report.serviceRecommendations} warning={false} forceBullet={true} />
             </SectionCard>
             )}

             {/* PROBLEM IMAGES (WHEN 1 OR 2 IMAGES) */}
             {imagesOnPage4.length > 0 && (
               <div style={{ marginTop: '14px' }}>
                 <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                   Photographic Evidence
                 </p>
                 <div style={{ display: 'grid', gridTemplateColumns: imagesOnPage4.length === 1 ? '1fr' : '1fr 1fr', gap: '14px' }}>
                   {imagesOnPage4.map((img: any, i: number) => {
                     const url = typeof img === 'string' ? img : img?.url;
                     const desc = typeof img === 'string' ? '' : (img?.description || '');
                     return (
                       <div key={i} style={{ backgroundColor: '#fff7f7', border: '1px solid #fecaca', borderRadius: '10px', overflow: 'hidden' }}>
                         <img
                           src={url}
                           alt={`Evidence ${i + 1}`}
                           crossOrigin="anonymous"
                           style={{ width: '100%', height: imagesOnPage4.length === 1 ? '200px' : '160px', objectFit: 'cover', display: 'block' }}
                         />
                         <div style={{ padding: '8px 12px' }}>
                           <p style={{ margin: '0 0 3px 0', fontSize: '10px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                             ⚠ Issue #{i + 1}
                           </p>
                           <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151', lineHeight: '1.4' }}>
                             {desc || 'Reported vehicle observation.'}
                           </p>
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             )}

          </div>
          <Footer pageNum={4} totalPages={totalPages} mobile={mobile} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            EXTRA PAGES (FOR EXTENDED PROBLEM IMAGE GALLERIES IF >2 IMAGES)
        ═══════════════════════════════════════════════════════════════════════ */}
        {separateImagePages.map((pageImgs, pageImgIndex) => (
          <div key={`img-page-${pageImgIndex}`} className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '20px 14px' : '40px 50px 30px 50px' }}>
            <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
            <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: mobile ? '16px' : '19px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '12px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '6px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>INSPECTION PROBLEM IMAGES</span>
                <span style={{ fontSize: '11.5px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id}</span>
              </h2>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
                  {pageImgs.map((img: any, i: number) => {
                    const url = typeof img === 'string' ? img : img?.url;
                    const desc = typeof img === 'string' ? '' : (img?.description || '');
                    const globalIdx = pageImgIndex * 4 + i + 1;
                    return (
                      <div key={i} style={{ backgroundColor: '#fff7f7', border: '1px solid #fecaca', borderRadius: '10px', overflow: 'hidden' }}>
                        <img
                          src={url}
                          alt={`Problem ${globalIdx}`}
                          crossOrigin="anonymous"
                          style={{ width: '100%', height: mobile ? '160px' : '180px', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ padding: '8px 12px' }}>
                          <p style={{ margin: '0 0 3px 0', fontSize: '10px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            ⚠ Issue #{globalIdx}
                          </p>
                          <p style={{ margin: 0, fontSize: '12px', fontWeight: 600, color: '#374151', lineHeight: '1.4' }}>
                            {desc || 'No description provided.'}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <Footer pageNum={4 + pageImgIndex + 1} totalPages={totalPages} mobile={mobile} />
          </div>
        ))}

      </div>
    </div>
  );
}

// ── Shared Subcomponents ──────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  width: '794px',
  minHeight: '1123px',
  backgroundColor: '#ffffff',
  boxSizing: 'border-box',
  fontFamily: '"Inter", sans-serif',
  position: 'relative',
  pageBreakAfter: 'always',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
};

const watermarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  fontWeight: 'bold',
  color: 'rgba(0, 89, 163, 0.03)',
  whiteSpace: 'nowrap',
  zIndex: 0,
  pointerEvents: 'none'
};

const labelStyle: React.CSSProperties = { margin: '0 0 3px 0', fontSize: '10px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' };
const valueStyle: React.CSSProperties = { margin: 0, fontSize: '14px', fontWeight: 800, color: '#111827', lineHeight: 1.2 };

function Footer({ pageNum, totalPages, mobile }: { pageNum: number, totalPages: number, mobile?: boolean }) {
  return (
    <div style={{
      zIndex: 1,
      borderTop: '2px solid #f3f4f6',
      paddingTop: '12px',
      marginTop: 'auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: mobile ? '9.5px' : '10.5px',
      color: '#9ca3af',
      fontWeight: 700,
      flexShrink: 0,
    }}>
      <div>Page {pageNum} / {totalPages}</div>
      <div style={{ color: '#0059A3', fontWeight: 900, letterSpacing: '0.05em' }}>caRya.krama Vehicle Inspection</div>
      <div>Confidential</div>
    </div>
  );
}

function SectionCard({ icon, title, children, mobile }: { icon?: React.ReactNode, title: string, children: React.ReactNode, mobile?: boolean }) {
  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '10px', padding: mobile ? '12px' : '14px 18px', backgroundColor: '#ffffff', marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '10px' }}>
        {icon && <div style={{ color: '#0059A3', display: 'flex', alignItems: 'center' }}>{icon}</div>}
        <h3 style={{ margin: 0, fontSize: mobile ? '12px' : '13px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}

function PanelsGrid({ text, mobile }: { text?: string, mobile?: boolean }) {
  if (!text) return <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>No observation</p>;
  const items = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);

  const renderItem = (item: string, idx: number) => {
    const cleanItem = item.replace(/^(\d+[\.\-\)]\s*|[•\-\*]\s*)/, '');
    return (
      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px' }}>
        <span style={{ color: '#059669', fontSize: '12px', fontWeight: 800, lineHeight: '1.3' }}>✓</span>
        <span style={{ fontSize: '12px', color: '#374151', lineHeight: '1.35', fontWeight: 500 }}>{cleanItem}</span>
      </div>
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '6px 20px' }}>
      <div>{col1.map((it, i) => renderItem(it, i))}</div>
      <div>{col2.map((it, i) => renderItem(it, i + mid))}</div>
    </div>
  );
}

function BulletList({ text, warning, forceBullet = false }: { text: string, warning: boolean, forceBullet?: boolean }) {
  if (!text) return null;
  let bullets = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  if (bullets.length === 1 && bullets[0].length > 40 && bullets[0].includes('. ') && forceBullet) {
    bullets = bullets[0].split('. ').map(s => s.trim() + (s.endsWith('.') ? '' : '.')).filter(s => s.length > 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
      {bullets.map((bullet, i) => {
         const cleanBullet = bullet.replace(/^(\d+[\.\-\)]\s*|[•\-\*]\s*)/, '');
         return (
           <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: warning ? '#dc2626' : '#0059A3', fontSize: '12.5px', fontWeight: 800, lineHeight: '1.5' }}>•</span>
              <p style={{ margin: 0, fontSize: '12.5px', color: warning ? '#991b1b' : '#374151', lineHeight: '1.5', fontWeight: 500 }}>
                 {cleanBullet}
              </p>
           </div>
         );
      })}
    </div>
  );
}

function FluidRow({ label, status, warning, action }: { label: string, status: string, warning: boolean, action: string }) {
  return (
    <tr>
      <td style={{ padding: '8px 10px', fontSize: '12.5px', fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>{label}</td>
      <td style={{ padding: '8px 10px', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>
         <span style={{ fontSize: '12.5px', fontWeight: 800, color: warning ? '#dc2626' : '#059669' }}>{status || "Clean"}</span>
      </td>
      <td style={{ padding: '8px 10px', fontSize: '12px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', fontWeight: 600, verticalAlign: 'middle' }}>{action}</td>
    </tr>
  );
}
