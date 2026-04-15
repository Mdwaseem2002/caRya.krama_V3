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
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const pdf = new jsPDF("p", "mm", [imgWidth, imgHeight]);
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    pdf.save(`Inspection_Report_${report.id}.pdf`);
  };

  const isWarning = (text: string) => {
    const lText = text?.toLowerCase() || "";
    return lText.includes("need") || lText.includes("leak") || lText.includes("damage") || lText.includes("fault") || lText.includes("issue");
  };

  return (
    <div>
      {/* Interactive Action Bar */}
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
          width: '800px', 
          margin: '0 auto', 
          backgroundColor: '#f8fafc',
          padding: '40px',
          boxSizing: 'border-box',
          fontFamily: '"Inter", sans-serif',
          color: '#111827'
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: 'center', paddingBottom: '32px', borderBottom: '3px solid #0059A3', marginBottom: '32px' }}>
          <div style={{ border: '3px solid #0059A3', padding: '24px', marginBottom: '32px', borderRadius: '16px' }}>
            <div style={{ display: 'table', margin: '0 auto 8px auto' }}>
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingRight: '12px' }}>
                  <div style={{ backgroundColor: '#0059A3', color: 'white', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={24} style={{ display: 'block', margin: 'auto' }} />
                  </div>
                </div>
                <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                  <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', lineHeight: '1', position: 'relative', top: '-7px' }}>
                    caRya.<span style={{ color: '#0059A3' }}>krama</span>
                  </h1>
                </div>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 800, color: '#6b7280', letterSpacing: '0.15em', textTransform: 'uppercase', lineHeight: '1', textAlign: 'center' }}>
              Professional Vehicle Inspection Services
            </p>
          </div>
          
          <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#0059A3', textTransform: 'uppercase', margin: '0 0 24px 0', letterSpacing: '-0.02em' }}>
            Vehicle Inspection Report
          </h2>

          <div style={{ display: 'table', width: '100%', backgroundColor: '#ffffff', padding: '16px 24px', borderRadius: '16px', border: '1px solid #e5e7eb', boxSizing: 'border-box' }}>
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', textAlign: 'center', width: '33%', borderRight: '1px solid #e5e7eb', padding: '0 10px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Date</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#374151', lineHeight: '1' }}>{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <div style={{ display: 'table-cell', textAlign: 'center', width: '33%', borderRight: '1px solid #e5e7eb', padding: '0 10px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Report ID</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#374151', lineHeight: '1' }}>{report.id}</p>
              </div>
              <div style={{ display: 'table-cell', textAlign: 'center', width: '33%', padding: '0 10px' }}>
                <p style={{ margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase' }}>Inspector</p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#374151', lineHeight: '1' }}>Master Tech Z.K.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        {carCoverImage && (
          <div style={{ position: 'relative', width: '100%', height: '350px', borderRadius: '24px', overflow: 'hidden', marginBottom: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <img src={carCoverImage} alt={report.carName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        )}

        {/* Vehicle Identification - SURGICAL TABLE LAYOUT */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'table', width: '100%', marginBottom: '20px', borderBottom: '1px solid #f3f4f6', paddingBottom: '16px' }}>
            <div style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                <div style={{ display: 'table' }}>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '24px', paddingRight: '8px' }}>
                       <CarIcon size={20} style={{ color: '#0059A3', display: 'block', marginTop: '2px' }} />
                    </div>
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', height: '24px' }}>
                       <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 900, color: '#111827', lineHeight: '24px', position: 'relative', top: '-4px' }}>Vehicle Identification</h3>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'right' }}>
                <div style={{ display: 'inline-table' }}>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', backgroundColor: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 12px', borderRadius: '50px', fontSize: '11px', fontWeight: 800, height: '24px' }}>
                      <div style={{ display: 'table' }}>
                        <div style={{ display: 'table-row' }}>
                          <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingRight: '4px', width: '12px' }}>
                             <div style={{ display: 'block', marginTop: '1px', width: '12px', height: '12px', borderRadius: '50%', border: '1.5px solid #16a34a', position: 'relative' }}>
                               <div style={{ position: 'absolute', top: '1px', left: '3px', width: '3px', height: '6px', borderBottom: '2px solid #16a34a', borderRight: '2px solid #16a34a', transform: 'rotate(45deg)' }}></div>
                             </div>
                          </div>
                          <div style={{ display: 'table-cell', verticalAlign: 'middle', lineHeight: '1', position: 'relative', top: '-4px' }}>Verified Profile</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '20px' }}>
             <InfoField label="Make & Model" value={report.vehicleDetails.carName} />
             <InfoField label="Year/Model" value={report.vehicleDetails.year || "-"} />
             <InfoField label="Odometer" value={report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"} />
             <div style={{ display: 'table' }}>
               <div style={{ display: 'table-row' }}>
                 <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                   <span style={{ fontSize: '9px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', marginBottom: '4px', display: 'block', lineHeight: '1' }}>Inspection Goal</span>
                   <span style={{ fontSize: '16px', fontWeight: 900, color: '#0059A3', textTransform: 'uppercase', lineHeight: '1' }}>STANDARD AUDIT</span>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Sections With SURGICAL TABLE ALIGNMENT */}
        <SectionHeader number="1" icon={<MapPin size={18} />} title="Body & Visual Inspection" />
        <div style={{ paddingLeft: '16px', marginBottom: '32px' }}>
           <BulletPoint text={report.bodyInspection.panelsChecked || "No observation"} subtext={report.bodyInspection.notes} warning={isWarning(report.bodyInspection.panelsChecked || report.bodyInspection.notes)} />
        </div>

        <SectionHeader number="2" icon={<Settings size={18} />} title="Engine Bay Mechanics" />
        <div style={{ paddingLeft: '16px', marginBottom: '32px' }}>
           {(report.engineBay || "").split('\n').filter(Boolean).map((line, i) => (
             <BulletPoint key={i} text={line} warning={isWarning(line)} />
           ))}
        </div>

        <SectionHeader number="3" icon={<Droplets size={18} />} title="Fluids & Lubricants" />
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
           <table style={{ width: '100%', borderCollapse: 'collapse' }}>
             <thead>
               <tr style={{ backgroundColor: '#f9fafb', fontSize: '10px', color: '#9ca3af', textTransform: 'uppercase' }}>
                 <th style={{ padding: '16px', fontWeight: 800, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Fluid Type</th>
                 <th style={{ padding: '16px', fontWeight: 800, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Current Status</th>
                 <th style={{ padding: '16px', fontWeight: 800, borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Action Required</th>
               </tr>
             </thead>
             <tbody>
               <TableRow label="Engine Oil" status={report.fluids.engineOil} warning={isWarning(report.fluids.engineOil)} action={report.fluids.serviceNotes} />
               <TableRow label="Coolant Antifreeze" status={report.fluids.coolant} warning={isWarning(report.fluids.coolant)} action="None" />
               <TableRow label="Brake Fluid" status={report.fluids.brakeOil} warning={isWarning(report.fluids.brakeOil)} action="None" />
             </tbody>
           </table>
        </div>

        <SectionHeader number="4" icon={<Battery size={18} />} title="Battery & Electrical Systems" />
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '16px', marginBottom: '32px' }}>
            <StatBox label="Resting Voltage" value={report.battery.ignitionVoltage || report.battery.crankingVoltage || "-"} />
            <StatBox label="Charging Voltage" value={report.battery.chargingVoltage || "-"} />
            <div style={{ display: 'table', width: '100%', height: '100%', backgroundColor: report.battery.systemWorking ? '#f0fdf4' : '#fef2f2', border: `1px solid ${report.battery.systemWorking ? '#bbf7d0' : '#fca5a5'}`, borderRadius: '16px', padding: '20px', boxSizing: 'border-box' }}>
               <div style={{ display: 'table-row' }}>
                 <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '50px' }}>
                    <div style={{ backgroundColor: report.battery.systemWorking ? '#dcfce7' : '#fee2e2', color: report.battery.systemWorking ? '#16a34a' : '#ef4444', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {report.battery.systemWorking ? <CheckCircle2 size={32} style={{ display: 'block', marginTop: '2px' }} /> : <AlertTriangle size={32} style={{ display: 'block', marginTop: '2px' }} />}
                    </div>
                 </div>
                 <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft: '16px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 800, color: report.battery.systemWorking ? '#166534' : '#991b1b', textTransform: 'uppercase', margin: '0 0 4px 0', letterSpacing: '0.05em', lineHeight: '1' }}>Health Status</p>
                    <p style={{ fontSize: '20px', fontWeight: 900, color: report.battery.systemWorking ? '#166534' : '#991b1b', margin: 0, lineHeight: '24px' }}>
                      {report.battery.systemWorking ? "Good / Acceptable" : "Requires Attention"}
                    </p>
                 </div>
               </div>
            </div>
         </div>

        <SectionHeader number="5" icon={<Cpu size={18} />} title="OBD Scans & Diagnostics" />
        <div style={{ paddingLeft: '16px', marginBottom: '32px' }}>
           <BulletPoint text="Fault Codes" subtext={report.obdScan.faultCodes || "None detected"} warning={isWarning(report.obdScan.faultCodes)} />
           <BulletPoint text="ECM Status" subtext={report.obdScan.ecmStatus || "No faults found in ECM"} warning={isWarning(report.obdScan.ecmStatus)} />
        </div>

        <SectionHeader number="6" icon={<ShieldCheck size={18} />} title="Verdict & Overall Summary" />
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '20px', padding: '24px' }}>
           <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800 }}>Mechanical & Body</h4>
           <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#4b5563', lineHeight: '1.4' }}>
             {report.overallSummary.mechanical} {report.overallSummary.body}
           </p>

           <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800, color: '#dc2626' }}>Issues & Precautions</h4>
           <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#4b5563', lineHeight: '1.4' }}>
             {report.verdict.issuesAttention} {report.precautions}
           </p>

           <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 800, color: '#0059A3' }}>Recommendation</h4>
           <div style={{ backgroundColor: '#f0f9ff', borderLeft: '4px solid #0059A3', padding: '12px 16px', borderRadius: '0 8px 8px 0', color: '#0059A3', fontWeight: 900, fontSize: '16px', lineHeight: '1' }}>
             {report.verdict.purchaseRecommendation || "Not Provided"}
           </div>
        </div>
      </div>
    </div>
  );
}

// ── SURGICAL ALIGNED SHARED COMPONENTS ──────────────────────────────

function InfoField({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'table', width: '100%', height: '36px' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
          <span style={{ fontSize: '9px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px', display: 'block', lineHeight: '1' }}>{label}</span>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#111827', display: 'block', lineHeight: '1' }}>{value}</span>
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ number, icon, title }: { number: string, icon: React.ReactNode, title: string }) {
  return (
    <div style={{ backgroundColor: '#f1f5f9', padding: '10px 20px', borderRadius: '16px', marginBottom: '20px', display: 'table', width: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '40px' }}>
          <div style={{ backgroundColor: '#e2e8f0', color: '#0059A3', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ marginTop: '2px' }}>{icon}</div>
          </div>
        </div>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft: '16px' }}>
          <h2 style={{ margin: 0, fontSize: '17px', fontWeight: 900, color: '#111827', textTransform: 'uppercase', lineHeight: '40px', position: 'relative', top: '-4px' }}>
            {number}. {title}
          </h2>
        </div>
      </div>
    </div>
  );
}

function BulletPoint({ text, subtext, warning }: { text: string, subtext?: string, warning: boolean }) {
  if (!text) return null;
  return (
    <div style={{ display: 'table', width: '100%', marginBottom: '16px' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '28px' }}>
           <div style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {warning ? <AlertTriangle size={18} style={{ color: '#ef4444', display: 'block', marginTop: '2px' }} /> : (
                <div style={{ display: 'block', marginTop: '2px', width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #10b981', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '2px', left: '4.5px', width: '5px', height: '9px', borderBottom: '2.5px solid #10b981', borderRight: '2.5px solid #10b981', transform: 'rotate(45deg)' }}></div>
                </div>
              )}
           </div>
        </div>
        <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft: '12px' }}>
          <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: warning ? '#ef4444' : '#111827', lineHeight: '24px', position: 'relative', top: '-4px' }}>{text}</p>
          {subtext && <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>{subtext}</p>}
        </div>
      </div>
    </div>
  );
}

function TableRow({ label, status, warning, action }: { label: string, status: string, warning: boolean, action: string }) {
  return (
    <tr style={{ height: '54px' }}>
      <td style={{ padding: '0 16px', fontSize: '13px', fontWeight: 800, color: '#111827', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>{label}</td>
      <td style={{ padding: '0 16px', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>
        <div style={{ display: 'table', height: '24px' }}>
          <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingRight: '8px', width: '16px' }}>
              {warning ? <AlertTriangle size={14} style={{ color: '#d97706', display: 'block', marginTop: '2px' }} /> : (
                <div style={{ display: 'block', marginTop: '2px', width: '14px', height: '14px', borderRadius: '50%', border: '1.5px solid #10b981', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '1px', left: '3.5px', width: '4px', height: '7px', borderBottom: '2px solid #10b981', borderRight: '2px solid #10b981', transform: 'rotate(45deg)' }}></div>
                </div>
              )}
            </div>
            <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: warning ? '#d97706' : '#10b981', lineHeight: '24px', position: 'relative', top: '-4px' }}>{status || "Clean"}</span>
            </div>
          </div>
        </div>
      </td>
      <td style={{ padding: '0 16px', fontSize: '12px', fontWeight: 600, color: '#6b7280', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle', lineHeight: '1.3' }}>{action || "None"}</td>
    </tr>
  );
}

function StatBox({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
      <p style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', margin: '0 0 6px 0', letterSpacing: '0.05em', lineHeight: '1' }}>{label}</p>
      <p style={{ fontSize: '24px', fontWeight: 900, color: '#111827', margin: 0, lineHeight: '1' }}>{value}</p>
    </div>
  );
}
