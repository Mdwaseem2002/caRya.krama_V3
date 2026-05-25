"use client";

import React, { useRef } from "react";
import { Download, CheckCircle2, AlertTriangle, ShieldCheck, Car as CarIcon, Settings, Droplets, Battery, MapPin, Cpu, Wrench } from "lucide-react";
import { useIsMobile } from "@/hooks/useIsMobile";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InspectionReportData } from "./InspectionStorage";
import InspectionReportDownload, { InspectionReportDownloadHandle } from "./InspectionReportDownload";

interface InspectionReportPDFViewProps {
  report: InspectionReportData;
  carCoverImage?: string;
  onClose: () => void;
}

const isWarning = (text: string) => {
  const lText = text?.toLowerCase() || "";
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
 
       {/* ── PDF Containers ────────────────────────────────────────────────────────── */}
       <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '20px' : '40px', width: '100%', maxWidth: '794px' }}>
        
        {/* PAGE 1 */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '24px 16px 60px 16px' : '50px 60px 100px 60px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* Top Header */}
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center', 
              alignItems: 'center', 
              border: '2px solid #0059A3', 
              borderRadius: '12px',
              padding: '24px 28px',
              marginBottom: '24px',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
              width: '100%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ backgroundColor: '#0059A3', color: 'white', padding: '6px', borderRadius: '8px' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <h1 style={{ margin: 0, fontSize: mobile ? '20px' : '26px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', lineHeight: '1' }}>caRya.<span style={{color: '#0059A3'}}>krama</span></h1>
              </div>
              <p style={{ margin: 0, fontSize: mobile ? '8px' : '10px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Professional Vehicle Inspection Services</p>
            </div>

            {/* Header Underline Divider */}
            <div style={{ width: '100%', height: '2px', backgroundColor: '#0059A3', marginBottom: '24px' }}></div>
            
            {/* Info Bar */}
            <div style={{ display: 'flex', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: mobile ? '12px 8px' : '16px', marginBottom: mobile ? '20px' : '32px' }}>
              <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e5e7eb' }}>
                 <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</p>
                 <p style={{ margin: 0, fontSize: mobile ? '11px' : '14px', fontWeight: 800, color: '#111827' }}>{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #e5e7eb' }}>
                 <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ID</p>
                 <p style={{ margin: 0, fontSize: mobile ? '11px' : '14px', fontWeight: 800, color: '#111827' }}>{report.id.split('-').pop()}</p>
              </div>
              <div style={{ flex: 1, textAlign: 'center' }}>
                 <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspector</p>
                 <p style={{ margin: 0, fontSize: mobile ? '11px' : '14px', fontWeight: 800, color: '#111827' }}>Z.K.</p>
              </div>
            </div>

            {/* Vehicle Image */}
            {carCoverImage ? (
              <div style={{ width: '100%', height: mobile ? '220px' : '360px', borderRadius: '16px', overflow: 'hidden', marginBottom: mobile ? '20px' : '32px', border: '1px solid #e5e7eb' }}>
                <img src={carCoverImage} alt={report.carName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
              </div>
            ) : (
              <div style={{ width: '100%', height: mobile ? '220px' : '360px', borderRadius: '16px', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: mobile ? '20px' : '32px', border: '1px solid #e5e7eb' }}>
                 <CarIcon size={mobile ? 40 : 80} style={{ color: '#cbd5e1' }} />
              </div>
            )}

            {/* Vehicle Details Card */}
            <div style={{ border: '1px solid #e5e7eb', borderRadius: '16px', padding: mobile ? '16px' : '24px', backgroundColor: '#ffffff' }}>
               <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'center', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '20px', gap: mobile ? '12px' : '0' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                   <div style={{ backgroundColor: '#f0f9ff', padding: '8px', borderRadius: '8px' }}><CarIcon size={20} style={{ color: '#0059A3' }} /></div>
                   <h3 style={{ margin: 0, fontSize: mobile ? '16px' : '18px', fontWeight: 900, color: '#111827', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>Vehicle Overview</h3>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#ecfdf5', color: '#059669', padding: '6px 12px', border: '1px solid #a7f3d0', borderRadius: '20px', fontSize: '10px', fontWeight: 700 }}>
                   <ShieldCheck size={14} /> Verified Badge
                 </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr 1fr' : '1fr 1fr 1fr 1fr', gap: mobile ? '20px 12px' : '24px', marginBottom: report.sellerDetails ? '20px' : '0' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: mobile ? '8px' : '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Make & Model</p>
                    <p style={{ margin: 0, fontSize: mobile ? '12px' : '15px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{report.vehicleDetails.carName}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: mobile ? '8px' : '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Year / Model</p>
                    <p style={{ margin: 0, fontSize: mobile ? '12px' : '15px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{report.vehicleDetails.year || "-"}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: mobile ? '8px' : '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Odometer</p>
                    <p style={{ margin: 0, fontSize: mobile ? '12px' : '15px', fontWeight: 800, color: '#111827', lineHeight: 1.2 }}>{report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"}</p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 4px 0', fontSize: mobile ? '8px' : '11px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Inspection</p>
                    <p style={{ margin: 0, fontSize: mobile ? '12px' : '16px', fontWeight: 900, color: '#0059A3', lineHeight: 1.2 }}>STANDARD</p>
                  </div>
               </div>
               
               {report.sellerDetails && (
                 <div style={{ display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '16px' : '60px', paddingTop: '16px', borderTop: '1px dashed #e5e7eb' }}>
                    <div>
                      <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '9px' : '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Seller Name</p>
                      <p style={{ margin: 0, fontSize: mobile ? '13px' : '14px', fontWeight: 800, color: '#374151' }}>{report.sellerDetails.name || "-"}</p>
                    </div>
                    <div>
                      <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '9px' : '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contact Number</p>
                      <p style={{ margin: 0, fontSize: mobile ? '13px' : '14px', fontWeight: 800, color: '#374151' }}>{report.sellerDetails.contactNumber || "-"}</p>
                    </div>
                 </div>
               )}
            </div>
          </div>
          
          <Footer pageNum={1} mobile={mobile} />
        </div>

        {/* PAGE 2 */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '24px 16px 60px 16px' : '50px 60px 100px 60px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <h2 style={{ margin: '0 0 28px 0', fontSize: mobile ? '18px' : '22px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '16px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '8px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>INSPECTION DETAILS</span>
                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id.split('-').pop()}</span>
             </h2>

             {/* 1. BODY & VISUAL INSPECTION */}
             <SectionCard icon={<MapPin size={22} />} title="1. BODY & VISUAL INSPECTION">
                <BulletList text={report.bodyInspection.panelsChecked || "No observation"} warning={false} />
                {report.bodyInspection.notes && report.bodyInspection.notes.trim() !== (report.engineBay || "").trim() && (
                  <BulletList text={report.bodyInspection.notes} warning={false} />
                )}
             </SectionCard>

             {/* 2. ENGINE BAY */}
             <SectionCard icon={<Settings size={22} />} title="2. ENGINE BAY">
               <BulletList text={report.engineBay || "No observations"} warning={false} />
             </SectionCard>
          </div>
          <Footer pageNum={2} mobile={mobile} />
        </div>

        {/* PAGE 3 */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '24px 16px 60px 16px' : '50px 60px 100px 60px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <h2 style={{ margin: '0 0 28px 0', fontSize: mobile ? '18px' : '22px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '16px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '8px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>TECHNICAL DETAILS</span>
                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id.split('-').pop()}</span>
             </h2>

             {/* 3. INTERIORS */}
             {report.interiors && (
             <SectionCard icon={<CarIcon size={22} />} title="3. INTERIORS & CABIN">
               <BulletList text={report.interiors.condition || "No interior observations"} warning={false} />
               <BulletList text={report.interiors.issues} warning={true} />
             </SectionCard>
             )}

             {/* 4. FLUIDS TABLE */}
             <SectionCard icon={<Droplets size={22} />} title="4. FLUIDS DEGRADATION \u0026 LEAKS" mobile={mobile}>
                <div style={{ width: '100%', overflowX: 'auto' }}>
                  <table style={{ width: '100%', minWidth: mobile ? '500px' : 'auto', borderCollapse: 'collapse', marginTop: '12px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb', fontWeight: 800 }}>Fluid Type</th>
                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb', fontWeight: 800 }}>Status</th>
                        <th style={{ padding: '10px 12px', borderBottom: '2px solid #e5e7eb', fontWeight: 800 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                       <FluidRow label="Engine Oil" status={report.fluids.engineOil} warning={isWarning(report.fluids.engineOil)} action={report.fluids.serviceNotes || "-"} />
                       <FluidRow label="Coolant / Antifreeze" status={report.fluids.coolant} warning={isWarning(report.fluids.coolant)} action="-" />
                       <FluidRow label="Brake Fluid" status={report.fluids.brakeOil} warning={isWarning(report.fluids.brakeOil)} action="-" />
                    </tbody>
                  </table>
                </div>
             </SectionCard>

             {/* 5. BATTERY & ELECTRICAL */}
             <SectionCard icon={<Battery size={22} />} title="5. BATTERY & ELECTRICAL" mobile={mobile}>
                 <div style={{ display: 'grid', gridTemplateColumns: mobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: mobile ? '8px' : '12px', marginTop: '12px' }}>
                    <div style={{ backgroundColor: '#f8fafc', padding: mobile ? '12px 8px' : '16px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Ignition</p>
                       <p style={{ margin: 0, fontSize: mobile ? '14px' : '17px', fontWeight: 900, color: '#111827' }}>{report.battery.ignitionVoltage || "-"}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: mobile ? '12px 8px' : '16px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Cranking</p>
                       <p style={{ margin: 0, fontSize: mobile ? '14px' : '17px', fontWeight: 900, color: '#111827' }}>{report.battery.crankingVoltage || "-"}</p>
                    </div>
                    <div style={{ backgroundColor: '#f8fafc', padding: mobile ? '12px 8px' : '16px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Charging</p>
                       <p style={{ margin: 0, fontSize: mobile ? '14px' : '17px', fontWeight: 900, color: '#111827' }}>{report.battery.chargingVoltage || "-"}</p>
                    </div>
                     <div style={{ backgroundColor: '#f8fafc', padding: mobile ? '12px 8px' : '16px', borderRadius: '12px', border: '1px solid #e5e7eb', textAlign: mobile ? 'center' : 'left' }}>
                       <p style={{ margin: '0 0 6px 0', fontSize: mobile ? '8px' : '10px', color: '#6b7280', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Load</p>
                       <p style={{ margin: 0, fontSize: mobile ? '14px' : '17px', fontWeight: 900, color: '#111827' }}>{report.battery.loadRange || "-"}</p>
                    </div>
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: report.battery.systemWorking ? '#ecfdf5' : '#fef2f2', padding: '16px', borderRadius: '12px', border: `1px solid ${report.battery.systemWorking ? '#a7f3d0' : '#fecaca'}`, marginTop: '16px' }}>
                    <div>
                      <CheckCircle2 size={mobile ? 20 : 24} color={report.battery.systemWorking ? "#059669" : "#dc2626"} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 2px 0', fontSize: mobile ? '9px' : '11px', color: report.battery.systemWorking ? '#059669' : '#dc2626', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>Health</p>
                      <p style={{ margin: 0, fontSize: mobile ? '12px' : '14px', fontWeight: 800, color: report.battery.systemWorking ? '#047857' : '#b91c1c' }}>{report.battery.systemWorking ? "System working properly" : "Requires attention"}</p>
                    </div>
                 </div>
             </SectionCard>

             {/* 6. OBD DIAGNOSTICS */}
             <SectionCard icon={<Cpu size={22} />} title="6. OBD DIAGNOSTICS">
                 <BulletList text={`Fault Codes: ${report.obdScan.faultCodes || "None detected"}`} warning={isWarning(report.obdScan.faultCodes)} />
                 <BulletList text={`ECM Status: ${report.obdScan.ecmStatus || "No faults found in ECM"}`} warning={isWarning(report.obdScan.ecmStatus)} />
             </SectionCard>
          </div>
          <Footer pageNum={3} mobile={mobile} />
        </div>

        {/* PAGE 4 */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '24px 16px 60px 16px' : '50px 60px 100px 60px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <h2 style={{ margin: '0 0 28px 0', fontSize: mobile ? '18px' : '22px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '16px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '8px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>ROAD TEST \u0026 FINAL SUMMARY</span>
                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id.split('-').pop()}</span>
             </h2>

             {/* 7. TEST DRIVE OBSERVATIONS */}
             {report.testDrive && (
             <SectionCard icon={<CarIcon size={22} />} title="7. TEST DRIVE OBSERVATIONS" mobile={mobile}>
                 <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Performance</p>
                      <BulletList text={report.testDrive.performance || "Not evaluated"} warning={isWarning(report.testDrive.performance)} mobile={mobile} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Stability</p>
                      <BulletList text={report.testDrive.braking || "Not evaluated"} warning={isWarning(report.testDrive.braking)} mobile={mobile} />
                    </div>
                 </div>
                 <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Transmission & Suspension</p>
                      <BulletList text={report.testDrive.observations || "No specific observations"} warning={false} mobile={mobile} />
                 </div>
             </SectionCard>
             )}

             {/* 8. VERDICT SECTION */}
             <SectionCard icon={<ShieldCheck size={22} />} title="8. VERDICT SECTION">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginTop: '4px' }}>
                   <div style={{ borderLeft: '5px solid #10b981', backgroundColor: '#f0fdf4', padding: '16px 20px', borderRadius: '0 12px 12px 0', border: '1px solid #d1fae5', borderLeftWidth: '5px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#065f46', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mechanically Sound</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#064e3b', fontWeight: 600, lineHeight: '1.5' }}>{report.verdict.mechanicalCondition || report.overallSummary?.mechanical || "-"}</p>
                   </div>
                   {report.overallSummary?.body && (
                   <div style={{ borderLeft: '5px solid #3b82f6', backgroundColor: '#eff6ff', padding: '16px 20px', borderRadius: '0 12px 12px 0', border: '1px solid #bfdbfe', borderLeftWidth: '5px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body Condition Summary</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#1e3a8a', fontWeight: 600, lineHeight: '1.5' }}>{report.overallSummary.body}</p>
                   </div>
                   )}
                   {report.verdict.issuesAttention && (
                   <div style={{ borderLeft: '5px solid #f59e0b', backgroundColor: '#fffbeb', padding: '16px 20px', borderRadius: '0 12px 12px 0', border: '1px solid #fef3c7', borderLeftWidth: '5px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#92400e', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issues Requiring Attention</p>
                      <p style={{ margin: 0, fontSize: '14px', color: '#78350f', fontWeight: 600, lineHeight: '1.5' }}>{report.verdict.issuesAttention}</p>
                   </div>
                   )}
                   <div style={{ borderLeft: '5px solid #0059A3', backgroundColor: '#f0f9ff', padding: '16px 20px', borderRadius: '0 12px 12px 0', border: '1px solid #e0f2fe', borderLeftWidth: '5px' }}>
                      <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Purchase Recommendation</p>
                      <p style={{ margin: 0, fontSize: '15px', color: '#0369a1', fontWeight: 800, lineHeight: '1.5' }}>{report.verdict.purchaseRecommendation || "Not Provided"}</p>
                   </div>
                </div>
             </SectionCard>
          </div>
          <Footer pageNum={4} mobile={mobile} />
        </div>

        {/* PAGE 5 */}
        <div className="pdf-page" style={{ ...pageStyle, width: '100%', maxWidth: '794px', minHeight: mobile ? 'auto' : '1123px', padding: mobile ? '24px 16px 60px 16px' : '50px 60px 100px 60px' }}>
          <div style={{ ...watermarkStyle, fontSize: mobile ? '60px' : '110px' }}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <h2 style={{ margin: '0 0 28px 0', fontSize: mobile ? '18px' : '22px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '16px', display: 'flex', flexDirection: mobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: mobile ? 'flex-start' : 'flex-end', gap: '8px' }}>
                <span style={{ letterSpacing: '-0.02em' }}>PRECAUTIONS & SERVICE</span>
                <span style={{ fontSize: '10px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' }}>REF: {report.id.split('-').pop()}</span>
             </h2>

             {/* 9. PRECAUTIONS & RECOMMENDATIONS */}
             <SectionCard icon={<AlertTriangle size={22} />} title="9. PRECAUTIONS & RECOMMENDATIONS">
                <BulletList text={report.precautions || "No generic precautions indicated."} warning={false} forceBullet={true} />
                {(report.fluids?.serviceNotes && report.fluids.serviceNotes !== "-") && (
                   <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e5e7eb' }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' }}>Service Recommendations</p>
                      <BulletList text={report.fluids.serviceNotes} warning={false} forceBullet={true} />
                   </div>
                )}
             </SectionCard>
          </div>
          <Footer pageNum={5} mobile={mobile} />
        </div>

      </div>
    </div>
  );
}

// ── Shared Subcomponents ──────────────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  width: '794px',
  minHeight: '1123px', // A4 proportion at 96 DPI
  backgroundColor: '#ffffff',
  padding: '50px 60px 100px 60px',
  boxSizing: 'border-box',
  fontFamily: '"Inter", sans-serif',
  position: 'relative',
  pageBreakAfter: 'always',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  overflow: 'visible'
};

const watermarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  fontSize: '110px',
  fontWeight: 900,
  color: 'rgba(0, 89, 163, 0.03)', // Very light opacity
  whiteSpace: 'nowrap',
  zIndex: 0,
  pointerEvents: 'none'
};

function Footer({ pageNum, mobile }: { pageNum: number, mobile?: boolean }) {
  return (
    <div style={{ position: 'absolute', bottom: mobile ? '16px' : '50px', left: mobile ? '16px' : '60px', right: mobile ? '16px' : '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '2px solid #f3f4f6', paddingTop: mobile ? '12px' : '20px', fontSize: mobile ? '8px' : '11px', color: '#9ca3af', fontWeight: 700, zIndex: 1 }}>
      <div>Page {pageNum} / 5</div>
      <div style={{ color: '#0059A3', fontWeight: 900, letterSpacing: '0.05em' }}>caRya.krama</div>
      {!mobile && <div>{new Date().toLocaleDateString('en-GB')}</div>}
    </div>
  );
}

function SectionCard({ icon, title, children, mobile }: { icon: React.ReactNode, title: string, children: React.ReactNode, mobile?: boolean }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: mobile ? '16px' : '24px', marginBottom: mobile ? '16px' : '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? '8px' : '12px', borderBottom: '1px solid #e5e7eb', paddingBottom: mobile ? '12px' : '16px', marginBottom: mobile ? '16px' : '20px' }}>
         <div style={{ backgroundColor: '#f0f9ff', padding: '8px', borderRadius: '8px', color: '#0059A3' }}>{icon}</div>
         <h3 style={{ margin: 0, fontSize: mobile ? '13px' : '16px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.02em' }}>{title}</h3>
      </div>
      <div>
         {children}
      </div>
    </div>
  );
}

function BulletList({ text, warning, forceBullet = false, large = false, mobile = false }: { text: string, warning: boolean, forceBullet?: boolean, large?: boolean, mobile?: boolean }) {
  if (!text) return null;
  // Try to split into bullets
  let bullets = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  
  if (bullets.length === 1 && bullets[0].length > 40 && bullets[0].includes('. ') && forceBullet) {
    bullets = bullets[0].split('. ').map(s => s.trim() + (s.endsWith('.') ? '' : '.')).filter(s => s.length > 1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '8px' : '12px', marginTop: '8px' }}>
      {bullets.map((bullet, i) => {
         const isWarn = warning || isWarning(bullet);
         return (
           <div key={i} style={{ display: 'flex', gap: mobile ? '8px' : '12px', alignItems: 'flex-start' }}>
              <div style={{ marginTop: large ? '2px' : '1px' }}>
                 {isWarn ? <AlertTriangle size={large ? 20 : (mobile ? 14 : 18)} style={{ color: '#ef4444' }} /> : <CheckCircle2 size={large ? 20 : (mobile ? 14 : 18)} style={{ color: '#10b981' }} />}
              </div>
              <p style={{ margin: 0, fontSize: large ? '15px' : (mobile ? '12px' : '14px'), color: isWarn ? '#991b1b' : '#374151', lineHeight: '1.6', fontWeight: 600 }}>
                 {bullet}
              </p>
           </div>
         );
      })}
    </div>
  );
}

function FluidRow({ label, status, warning, action }: { label: string, status: string, warning: boolean, action: string }) {
  const isWarn = warning || status.toLowerCase().includes("dirty") || status.toLowerCase().includes("low") || status.toLowerCase().includes("attention") || status.toLowerCase().includes("replace");
  return (
    <tr>
      <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb' }}>{label}</td>
      <td style={{ padding: '14px 12px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           {isWarn ? <AlertTriangle size={16} style={{ color: '#d97706' }} /> : <CheckCircle2 size={16} style={{ color: '#10b981' }} />}
           <span style={{ fontSize: '14px', fontWeight: 800, color: isWarn ? '#d97706' : '#10b981' }}>{status || "Clean"}</span>
        </div>
      </td>
      <td style={{ padding: '14px 12px', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', fontWeight: 600 }}>{action}</td>
    </tr>
  );
}
