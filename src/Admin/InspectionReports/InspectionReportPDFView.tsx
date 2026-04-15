"use client";

import React, { useRef } from "react";
import { Download, CheckCircle2, AlertTriangle, ShieldCheck, Car as CarIcon, Settings, Droplets, Battery, MapPin, Cpu } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InspectionReportData } from "./InspectionStorage";

interface InspectionReportPDFViewProps {
  report: InspectionReportData;
  carCoverImage?: string;
  onClose: () => void;
}

export default function InspectionReportPDFView({ report, carCoverImage, onClose }: InspectionReportPDFViewProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    
    // Scale up for better resolution
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL("image/png");
    
    // Calculate PDF dimensions - maintain A4 width (210mm) and scale height based on content
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Create jsPDF instance with custom page size [width, height]
    const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
    
    // Add the image as a single continuous block
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    
    pdf.save(`Inspection_Report_${report.id}.pdf`);
  };

  // Helper to figure out if text indicates an issue (contains "alert", "error", "leak", "damage", "need")
  const isWarning = (text: string) => {
    const lText = text.toLowerCase();
    return lText.includes("need") || lText.includes("leak") || lText.includes("damage") || lText.includes("fault") || lText.includes("issue");
  };

  return (
    <div>
      {/* Interactive Action Bar (Excluded from PDF) */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', position: 'sticky', top: '10px', zIndex: 50 }}>
        <button onClick={onClose} style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '10px', fontWeight: 700, border: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          ← Back
        </button>
        <button onClick={handleDownloadPDF} style={{ padding: '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 10px rgba(0, 89, 163, 0.3)' }}>
          <Download size={18} /> Download PDF
        </button>
      </div>

      {/* ── PDF Container ────────────────────────────────────────────────────────── */}
      <div 
        ref={printRef}
        style={{ 
          width: '100%', 
          maxWidth: '800px', 
          margin: '0 auto', 
          backgroundColor: '#f8fafc', // Very subtle off-white back
          padding: '40px',
          boxSizing: 'border-box',
          fontFamily: '"Inter", sans-serif',
          color: '#111827'
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', paddingBottom: '32px', borderBottom: '3px solid #0059A3', marginBottom: '32px' }}>
          {/* Branding Rectangle */}
          <div style={{ border: '3px solid #0059A3', padding: '24px', marginBottom: '32px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ backgroundColor: '#0059A3', color: 'white', padding: '6px', borderRadius: '8px', display: 'inline-flex' }}>
                <ShieldCheck size={24} />
              </div>
              <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em' }}>
                caRya.<span style={{ color: '#0059A3' }}>krama</span>
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Professional Vehicle Inspection Services
            </p>
          </div>
          
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0059A3', textTransform: 'uppercase', margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>
            Vehicle Inspection Report
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Date</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#374151' }}>{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1, borderRight: '1px solid #e5e7eb' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Report ID</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#374151' }}>{report.id}</p>
            </div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Inspector</p>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#374151' }}>Master Tech Z.K.</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {carCoverImage && (
          <div style={{ position: 'relative', width: '100%', height: '300px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <img src={carCoverImage} alt={report.carName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
            <div style={{ position: 'absolute', bottom: '16px', left: '16px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '8px' }}>
              <span style={{ color: 'white', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Asset Visual Context</span>
            </div>
          </div>
        )}

        {/* Vehicle Identification Card */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 900, color: '#111827' }}>
              <CarIcon size={20} style={{ color: '#0059A3' }} /> Vehicle Identification
            </h3>
            <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Verified Profile
            </span>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
             <InfoField label="Make & Model" value={report.vehicleDetails.carName} />
             <InfoField label="Year/Model" value={report.vehicleDetails.year || "-"} />
             <InfoField label="Current Odometer" value={report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"} />
             <InfoField label="Transmission" value="-" />
             <InfoField label="Fuel & Engine" value="-" />
             <InfoField label="VIN Number" value={`CK-${report.id.split('-')[1]}`} />
             <InfoField label="Exterior Color" value="-" />
             <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>Inspection Goal</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#0059A3', textTransform: 'uppercase' }}>STANDARD AUDIT</span>
             </div>
          </div>
        </div>

        {/* Seller Details Card */}
        {report.sellerDetails && (report.sellerDetails.name || report.sellerDetails.contactNumber) && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '24px', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
              <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', fontWeight: 900, color: '#111827' }}>
                <ShieldCheck size={20} style={{ color: '#0059A3' }} /> Seller Details
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
               <InfoField label="Seller Name" value={report.sellerDetails.name || "Not Specified"} />
               <InfoField label="Contact Number" value={report.sellerDetails.contactNumber || "Not Specified"} />
            </div>
          </div>
        )}

        {/* 1. Body & Visual Inspection */}
        <SectionHeader number="1" icon={<MapPin size={18} />} title="Body & Visual Inspection" />
        <div style={{ paddingLeft: '16px', marginBottom: '32px' }}>
           <BulletPoint text={report.bodyInspection.panelsChecked || "No observation"} subtext={report.bodyInspection.notes} warning={isWarning(report.bodyInspection.panelsChecked || report.bodyInspection.notes)} />
        </div>

        {/* 2. Engine Bay Mechanics */}
        <SectionHeader number="2" icon={<Settings size={18} />} title="Engine Bay Mechanics" />
        <div style={{ paddingLeft: '16px', marginBottom: '32px' }}>
           {report.engineBay.split('\n').filter(Boolean).map((line, i) => (
             <BulletPoint key={i} text={line} warning={isWarning(line)} />
           ))}
        </div>

        {/* 3. Fluids & Lubricants Table */}
        <SectionHeader number="3" icon={<Droplets size={18} />} title="Fluids & Lubricants" />
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
             <thead>
               <tr style={{ backgroundColor: '#f9fafb', fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                 <th style={{ padding: '16px', fontWeight: 800, borderBottom: '1px solid #e5e7eb' }}>Fluid Type</th>
                 <th style={{ padding: '16px', fontWeight: 800, borderBottom: '1px solid #e5e7eb' }}>Current Status</th>
                 <th style={{ padding: '16px', fontWeight: 800, borderBottom: '1px solid #e5e7eb' }}>Action Required</th>
               </tr>
             </thead>
             <tbody>
               <TableRow label="Engine Oil" status={report.fluids.engineOil} warning={isWarning(report.fluids.engineOil)} action={report.fluids.serviceNotes} />
               <TableRow label="Coolant Antifreeze" status={report.fluids.coolant} warning={isWarning(report.fluids.coolant)} action="None" />
               <TableRow label="Brake Fluid" status={report.fluids.brakeOil} warning={isWarning(report.fluids.brakeOil)} action="None" />
             </tbody>
           </table>
        </div>

        {/* 4. Battery & Electrical Systems */}
        <SectionHeader number="4" icon={<Battery size={18} />} title="Battery & Electrical Systems" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', marginBottom: '32px' }}>
           <StatBox label="Resting Voltage" value={report.battery.ignitionVoltage || report.battery.crankingVoltage || "-"} />
           <StatBox label="Charging Voltage" value={report.battery.chargingVoltage || "-"} />
           <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: report.battery.systemWorking ? '#f0fdf4' : '#fef2f2', border: `1px solid ${report.battery.systemWorking ? '#bbf7d0' : '#fca5a5'}`, borderRadius: '16px', padding: '20px' }}>
              {report.battery.systemWorking ? <CheckCircle2 size={32} style={{ color: '#16a34a' }} /> : <AlertTriangle size={32} style={{ color: '#dc2626' }} />}
              <div>
                 <p style={{ fontSize: '10px', fontWeight: 800, color: report.battery.systemWorking ? '#166534' : '#991b1b', textTransform: 'uppercase', margin: '0 0 4px 0', letterSpacing: '0.05em' }}>Health Status</p>
                 <p style={{ fontSize: '18px', fontWeight: 900, color: report.battery.systemWorking ? '#166534' : '#991b1b', margin: 0 }}>
                   {report.battery.systemWorking ? "Good / Acceptable" : "Requires Attention"}
                 </p>
              </div>
           </div>
        </div>

        {/* 5. OBD & Diagnostics */}
        <SectionHeader number="5" icon={<Cpu size={18} />} title="OBD Scans & Diagnostics" />
        <div style={{ paddingLeft: '16px', marginBottom: '32px' }}>
           <BulletPoint text="Fault Codes" subtext={report.obdScan.faultCodes || "None detected"} warning={isWarning(report.obdScan.faultCodes)} />
           <BulletPoint text="ECM Status" subtext={report.obdScan.ecmStatus || "No faults found in ECM"} warning={isWarning(report.obdScan.ecmStatus)} />
        </div>

        {/* 6. Verdict & Summary */}
        <SectionHeader number="6" icon={<ShieldCheck size={18} />} title="Verdict & Overall Summary" />
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
           <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800 }}>Mechanical & Body</h4>
           <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#4b5563', lineHeight: 1.5 }}>
             {report.overallSummary.mechanical} {report.overallSummary.body}
           </p>

           <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800, color: '#dc2626' }}>Issues & Precautions</h4>
           <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#4b5563', lineHeight: 1.5 }}>
             {report.verdict.issuesAttention} {report.precautions}
           </p>

           <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800, color: '#0059A3' }}>Purchase Recommendation</h4>
           <div style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #0059A3', padding: '12px 16px', borderRadius: '0 8px 8px 0', color: '#0059A3', fontWeight: 800, fontSize: '14px' }}>
             {report.verdict.purchaseRecommendation || "Not Provided"}
           </div>
        </div>

      </div>
    </div>
  );
}

// ── Shared UI Components matching PDF design ──────────────────────────────

function InfoField({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontSize: '9px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px', letterSpacing: '0.05em' }}>{label}</span>
      <span style={{ fontSize: '16px', fontWeight: 800, color: '#111827' }}>{value}</span>
    </div>
  );
}

function SectionHeader({ number, icon, title }: { number: string, icon: React.ReactNode, title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', backgroundColor: '#f1f5f9', padding: '12px 20px', borderRadius: '16px', marginBottom: '20px' }}>
      <div style={{ backgroundColor: '#e2e8f0', color: '#0059A3', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {icon}
      </div>
      <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#111827', textTransform: 'uppercase' }}>
        {number}. {title}
      </h2>
    </div>
  );
}

function BulletPoint({ text, subtext, warning }: { text: string, subtext?: string, warning: boolean }) {
  if (!text) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '16px' }}>
      <div style={{ marginTop: '2px' }}>
        {warning ? <AlertTriangle size={18} style={{ color: '#ef4444' }} /> : <CheckCircle2 size={18} style={{ color: '#10b981' }} />}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: warning ? '#ef4444' : '#111827' }}>{text}</p>
        {subtext && <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.5 }}>{subtext}</p>}
      </div>
    </div>
  );
}

function TableRow({ label, status, warning, action }: { label: string, status: string, warning: boolean, action: string }) {
  return (
    <tr>
      <td style={{ padding: '16px', fontSize: '13px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #e5e7eb' }}>{label}</td>
      <td style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 800, color: warning ? '#d97706' : '#10b981' }}>
          {warning ? <AlertTriangle size={14} /> : <CheckCircle2 size={14} />} {status || "Clean"}
        </div>
      </td>
      <td style={{ padding: '16px', fontSize: '13px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb' }}>{action || "None"}</td>
    </tr>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 8px 0', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: 0 }}>{value}</p>
    </div>
  );
}
