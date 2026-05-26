"use client";

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, CheckCircle2, AlertTriangle, ShieldCheck, Car as CarIcon, Settings, Droplets, Battery, MapPin, Cpu } from "lucide-react";
import { InspectionReportData, getInspectionReport } from "./InspectionStorage";
import { addAdminNotification } from "@/Details/Notification/AdminNotify";

interface Props {
  reportId?: string;
  initialReport?: InspectionReportData;
  carCoverImage?: string;
  onClose?: () => void;
}

const isWarning = (text: string) => {
  const lText = text?.toLowerCase() || "";
  return lText.includes("need") || lText.includes("leak") || lText.includes("damage") || lText.includes("fault") || lText.includes("issue") || lText.includes("replace") || lText.includes("bad") || lText.includes("attention");
};

export interface InspectionReportDownloadHandle {
  handleDownloadPDF: () => Promise<void>;
}

const InspectionReportDownload = forwardRef<InspectionReportDownloadHandle, Props>(({ reportId, initialReport, carCoverImage, onClose }, ref) => {
  const [report, setReport] = useState<InspectionReportData | null>(initialReport || null);
  const [loading, setLoading] = useState(!initialReport && !!reportId);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialReport && reportId) {
      setLoading(true);
      getInspectionReport(reportId).then(data => {
        if (data) setReport(data);
        else setError("Report not found");
        setLoading(false);
      }).catch(e => {
        setError("Error fetching report");
        setLoading(false);
      });
    }
  }, [reportId, initialReport]);

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const pages = printRef.current.querySelectorAll('.pdf-page');
    if (pages.length === 0) return;

    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;

    for (let i = 0; i < pages.length; i++) {
       const page = pages[i] as HTMLElement;
       const canvas = await html2canvas(page, {
         scale: 2,
         useCORS: true,
         logging: false,
         letterRendering: true,
       } as any);
       
       const imgData = canvas.toDataURL("image/jpeg", 0.85);
       const imgHeight = (canvas.height * imgWidth) / canvas.width;
       
       if (i > 0) pdf.addPage();
       pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
    }
    
    pdf.save(`Inspection_Report_${report?.id || 'Download'}.pdf`);

    // Trigger Admin Notification
    try {
      await addAdminNotification({
        title: "Report Downloaded 📄",
        message: `Official report for ${report?.vehicleDetails?.carName || 'a vehicle'} was downloaded.`,
        type: "report",
        cta: { label: "View Logs", href: "/admin/inspection-reports" }
      });
    } catch (e) {
      console.error("Failed to send admin notification", e);
    }
  };

  useImperativeHandle(ref, () => ({
    handleDownloadPDF
  }));

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Report Data...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!report) return null;

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '40px 20px', minHeight: '100vh', textAlign: 'center' }}>

      <div ref={printRef} style={{ display: 'inline-block', textAlign: 'left' }}>
        {/* PAGE 1 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            {/* TABLE FORMAT HEADER */}
            <div style={{ border: '2px solid #0059A3', borderRadius: '12px', padding: '24px', marginBottom: '24px', backgroundColor: '#ffffff', width: '100%', boxSizing: 'border-box' }}>
               <div style={{ textAlign: 'center' }}>
                  <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 900, color: '#111827', letterSpacing: '-0.02em', lineHeight: '1' }}>caRya.<span style={{color: '#0059A3'}}>krama</span></h1>
               </div>
               <p style={{ margin: '10px 0 0 0', fontSize: '10px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Professional Vehicle Inspection Services</p>
            </div>

            <div style={{ width: '100%', height: '2px', backgroundColor: '#0059A3', marginBottom: '24px' }}></div>
            
            {/* INFO BAR IN TABLE FORMAT */}
            <div style={{ display: 'table', width: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', borderCollapse: 'separate', overflow: 'hidden', marginBottom: '32px' }}>
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '16px', borderRight: '1px solid #e5e7eb', width: '33.33%' }}>
                   <p style={labelStyle}>Date</p>
                   <p style={valueStyle}>{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '16px', borderRight: '1px solid #e5e7eb', width: '33.33%' }}>
                   <p style={labelStyle}>Report ID</p>
                   <p style={valueStyle}>{report.id}</p>
                </div>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '16px', width: '33.33%' }}>
                   <p style={labelStyle}>Inspector Name</p>
                   <p style={valueStyle}>Master Tech {(report as any).inspectorName || "Z.K."}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'table', width: '100%', height: '360px', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px', border: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
               <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                    {carCoverImage ? (
                      <img src={carCoverImage} alt="Car" style={{ width: '100%', height: '360px', objectFit: 'cover' }} crossOrigin="anonymous" />
                    ) : (
                      <div style={{ color: '#cbd5e1' }}>No Image</div>
                    )}
                  </div>
               </div>
            </div>

            <SectionCard title="Vehicle Overview" 
              badge={
                <div style={{ display: 'inline-block', fontSize: '11px', fontWeight: 700, color: '#059669', whiteSpace: 'nowrap', verticalAlign: 'middle', position: 'relative', top: '-1px', textDecoration: 'underline' }}>
                   Verified Badge
                </div>
              }
            >
               <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '12px 24px', margin: '-12px -12px' }}>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', padding: '0 12px', width: '33.33%' }}>
                      <p style={labelStyle}>Make & Model</p>
                      <p style={valueStyle}>{report.vehicleDetails.carName}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 12px', width: '33.33%' }}>
                      <p style={labelStyle}>Year / Model</p>
                      <p style={valueStyle}>{report.vehicleDetails.year || "-"}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 12px', width: '33.33%' }}>
                      <p style={labelStyle}>Odometer</p>
                      <p style={valueStyle}>{report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"}</p>
                    </div>
                  </div>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', padding: '0 12px', width: '33.33%' }}>
                      <p style={labelStyle}>Seller Name</p>
                      <p style={{ ...valueStyle, color: '#374151' }}>{report.sellerDetails?.name || "caRya.krama"}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 12px', width: '33.33%' }}>
                      <p style={labelStyle}>Contact Number</p>
                      <p style={{ ...valueStyle, color: '#374151' }}>{report.sellerDetails?.contactNumber || "N/A"}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 12px', width: '33.33%' }}>
                      <p style={labelStyle}>Location</p>
                      <p style={{ ...valueStyle, color: '#374151' }}>{(report.sellerDetails as any)?.location || "Bangalore, IN"}</p>
                    </div>
                  </div>
               </div>
            </SectionCard>
          </div>
          <Footer pageNum={1} />
        </div>

        {/* PAGE 2 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                <div style={{ display: 'table-row' }}>
                   <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                      <span>INSPECTION DETAILS</span>
                   </div>
                   <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                      <span style={refStyle}>REF: {report.id}</span>
                   </div>
                </div>
             </div>

             <SectionCard title="1. BODY & VISUAL INSPECTION">
                <BulletList text={report.bodyInspection.panelsChecked || "No observation"} warning={false} />
                {report.bodyInspection.notes && report.bodyInspection.notes.trim() !== (report.engineBay || "").trim() && (
                  <BulletList text={report.bodyInspection.notes} warning={false} />
                )}
             </SectionCard>

             <SectionCard title="2. ENGINE BAY">
               <BulletList text={report.engineBay || "No observations"} warning={false} />
             </SectionCard>
          </div>
          <Footer pageNum={2} />
        </div>

        {/* PAGE 3 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                <div style={{ display: 'table-row' }}>
                   <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                      <span>TECHNICAL DETAILS</span>
                   </div>
                   <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                      <span style={refStyle}>REF: {report.id}</span>
                   </div>
                </div>
             </div>

             <SectionCard title="3. INTERIORS & CABIN">
               <BulletList text={report.interiors.condition || "No interior observations"} warning={false} />
               <BulletList text={report.interiors.issues} warning={true} />
             </SectionCard>

             <SectionCard title="4. FLUIDS DEGRADATION & LEAKS">
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '12px' }}>
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
             </SectionCard>

             <SectionCard title="5. BATTERY & ELECTRICAL">
                 <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '12px', margin: '-12px', marginTop: '4px' }}>
                    <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                         <p style={labelStyle}>Ignition</p>
                         <p style={batteryValueStyle}>{report.battery.ignitionVoltage || "-"}</p>
                      </div>
                      <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                         <p style={labelStyle}>Cranking</p>
                         <p style={batteryValueStyle}>{report.battery.crankingVoltage || "-"}</p>
                      </div>
                      <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                         <p style={labelStyle}>Charging</p>
                         <p style={batteryValueStyle}>{report.battery.chargingVoltage || "-"}</p>
                      </div>
                      <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                         <p style={labelStyle}>Load Range</p>
                         <p style={batteryValueStyle}>{report.battery.loadRange || "-"}</p>
                      </div>
                    </div>
                 </div>

                 <div style={{ display: 'table', width: '100%', backgroundColor: report.battery.systemWorking ? '#ecfdf5' : '#fef2f2', padding: '16px', borderRadius: '12px', border: `1px solid ${report.battery.systemWorking ? '#a7f3d0' : '#fecaca'}`, marginTop: '16px', boxSizing: 'border-box' }}>
                         <p style={{ margin: '0 0 2px 0', fontSize: '11px', color: report.battery.systemWorking ? '#059669' : '#dc2626', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>System Health</p>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: report.battery.systemWorking ? '#047857' : '#b91c1c' }}>{report.battery.systemWorking ? "Battery & alternator charging system working properly" : "Charging system requires attention"}</p>
                      </div>
             </SectionCard>

             <SectionCard title="6. OBD DIAGNOSTICS">
                 <BulletList text={`Fault Codes: ${report.obdScan.faultCodes || "None detected"}`} warning={isWarning(report.obdScan.faultCodes)} />
                 <BulletList text={`ECM Status: ${report.obdScan.ecmStatus || "No faults found in ECM"}`} warning={isWarning(report.obdScan.ecmStatus)} />
             </SectionCard>
          </div>
          <Footer pageNum={3} />
        </div>

        {/* PAGE 4 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                <div style={{ display: 'table-row' }}>
                   <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                      <span>ROAD TEST & FINAL SUMMARY</span>
                   </div>
                   <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                      <span style={refStyle}>REF: {report.id}</span>
                   </div>
                </div>
             </div>

             {report.testDrive && (
             <SectionCard title="7. TEST DRIVE OBSERVATIONS">
                 <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '16px 0', marginLeft: '-16px' }}>
                    <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', width: '50%', paddingLeft: '16px' }}>
                        <p style={subHeaderStyle}>Driving Performance</p>
                        <BulletList text={report.testDrive.performance || "Not evaluated"} warning={isWarning(report.testDrive.performance)} />
                      </div>
                      <div style={{ display: 'table-cell', width: '50%' }}>
                        <p style={subHeaderStyle}>Braking & Stability</p>
                        <BulletList text={report.testDrive.braking || "Not evaluated"} warning={isWarning(report.testDrive.braking)} />
                      </div>
                    </div>
                 </div>
                 <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                      <p style={subHeaderStyle}>Transmission & Suspension</p>
                      <BulletList text={report.testDrive.observations || "No specific observations"} warning={false} />
                 </div>
             </SectionCard>
             )}

             <SectionCard title="8. VERDICT SECTION">
                <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                   <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', ...verdictBoxStyle('#10b981', '#f0fdf4', '#065f46') }}>
                        <p style={verdictLabelStyle('#065f46')}>Mechanically Sound</p>
                        <p style={verdictTextStyle('#064e3b')}>{report.verdict.mechanicalCondition || report.overallSummary?.mechanical || "-"}</p>
                      </div>
                   </div>
                   {report.overallSummary?.body && (
                   <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', ...verdictBoxStyle('#3b82f6', '#eff6ff', '#1e40af') }}>
                        <p style={verdictLabelStyle('#1e40af')}>Body Condition Summary</p>
                        <p style={verdictTextStyle('#1e3a8a')}>{report.overallSummary.body}</p>
                      </div>
                   </div>
                   )}
                   {report.verdict.issuesAttention && (
                   <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', ...verdictBoxStyle('#f59e0b', '#fffbeb', '#92400e') }}>
                        <p style={verdictLabelStyle('#92400e')}>Issues Requiring Attention</p>
                        <p style={verdictTextStyle('#78350f')}>{report.verdict.issuesAttention}</p>
                      </div>
                   </div>
                   )}
                   <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', ...verdictBoxStyle('#0059A3', '#f0f9ff', '#0059A3') }}>
                        <p style={verdictLabelStyle('#0059A3')}>Purchase Recommendation</p>
                        <p style={{ ...verdictTextStyle('#0369a1'), fontSize: '15px', fontWeight: 800 }}>{report.verdict.purchaseRecommendation || "Not Provided"}</p>
                      </div>
                   </div>
                </div>
             </SectionCard>
          </div>
          <Footer pageNum={4} />
        </div>

        {/* PAGE 5 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1 }}>
             <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                <div style={{ display: 'table-row' }}>
                   <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                      <span>PRECAUTIONS & SERVICE</span>
                   </div>
                   <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                      <span style={refStyle}>REF: {report.id}</span>
                   </div>
                </div>
             </div>

             <SectionCard title="9. PRECAUTIONS & RECOMMENDATIONS">
                <BulletList text={report.precautions || "No generic precautions indicated."} warning={false} forceBullet={true} />
                {(report.fluids?.serviceNotes && report.fluids.serviceNotes !== "-") && (
                   <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed #e5e7eb' }}>
                      <p style={subHeaderStyle}>Service Recommendations</p>
                      <BulletList text={report.fluids.serviceNotes} warning={false} forceBullet={true} />
                   </div>
                )}
             </SectionCard>
          </div>
          <Footer pageNum={5} />
        </div>
      </div>
    </div>
  );
});

export default InspectionReportDownload;

// ── Shared Subcomponents & Styles ──────────────────────────────────────────

const pageStyle: React.CSSProperties = {
  width: '794px',
  height: '1123px',
  backgroundColor: '#ffffff',
  padding: '50px 60px 100px 60px',
  boxSizing: 'border-box',
  fontFamily: 'Arial, sans-serif',
  position: 'relative',
  pageBreakAfter: 'always',
  overflow: 'hidden',
  marginBottom: '24px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)'
};

const watermarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  fontSize: '110px',
  fontWeight: 'bold',
  color: 'rgba(0, 89, 163, 0.03)',
  whiteSpace: 'nowrap',
  zIndex: 0,
  pointerEvents: 'none'
};

const labelStyle: React.CSSProperties = { margin: '0 0 6px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' };
const valueStyle: React.CSSProperties = { margin: 0, fontSize: '14px', fontWeight: 800, color: '#111827' };
const pageHeaderStyle: React.CSSProperties = { margin: '0 0 28px 0', fontSize: '22px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' };
const refStyle: React.CSSProperties = { fontSize: '12px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' };
const subHeaderStyle: React.CSSProperties = { margin: '0 0 8px 0', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' };
const batteryStatBoxStyle: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e5e7eb' };
const batteryValueStyle: React.CSSProperties = { margin: 0, fontSize: '17px', fontWeight: 900, color: '#111827' };

function Footer({ pageNum }: { pageNum: number }) {
  return (
    <div style={{ position: 'absolute', bottom: '50px', left: '60px', right: '60px', display: 'table', width: '674px', borderTop: '2px solid #f3f4f6', paddingTop: '20px', fontSize: '11px', color: '#9ca3af', fontWeight: 700, zIndex: 1 }}>
      <div style={{ display: 'table-row' }}>
         <div style={{ display: 'table-cell', textAlign: 'left', width: '33.3%' }}>Page {pageNum} / 5</div>
         <div style={{ display: 'table-cell', textAlign: 'center', width: '33.3%', color: '#0059A3', fontWeight: 900, letterSpacing: '0.05em' }}>caRya.krama Vehicle Inspection</div>
         <div style={{ display: 'table-cell', textAlign: 'right', width: '33.3%' }}>Confidential</div>
      </div>
    </div>
  );
}

function SectionCard({ title, children, badge }: { title: string, children: React.ReactNode, badge?: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'table', width: '100%', borderBottom: '1px solid #e5e7eb', paddingBottom: '16px', marginBottom: '20px' }}>
         <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
               <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '1.2', position: 'relative', top: '-1px' }}>{title}</h3>
            </div>
            <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'right' }}>
               {badge}
            </div>
         </div>
      </div>
      <div>{children}</div>
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
    <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px', marginTop: '4px' }}>
      {bullets.map((bullet, i) => {
         const isWarn = warning || isWarning(bullet);
         return (
           <div key={i} style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                 <p style={{ margin: 0, fontSize: '14px', color: isWarn ? '#991b1b' : '#374151', lineHeight: '1.4', fontWeight: 600, position: 'relative', top: '-1.5px' }}>
                    • {bullet}
                 </p>
              </div>
           </div>
         );
      })}
    </div>
  );
}

function FluidRow({ label, status, warning, action }: { label: string, status: string, warning: boolean, action: string }) {
  const isWarn = warning || status.toLowerCase().includes("dirty") || status.toLowerCase().includes("low") || status.toLowerCase().includes("attention");
  return (
    <tr>
      <td style={{ padding: '14px 12px', fontSize: '14px', fontWeight: 700, color: '#111827', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>{label}</td>
      <td style={{ padding: '14px 12px', borderBottom: '1px solid #e5e7eb', verticalAlign: 'middle' }}>
         <span style={{ fontSize: '14px', fontWeight: 800, color: isWarn ? '#d97706' : '#10b981', lineHeight: '1.2', position: 'relative', top: '-1.5px' }}>{status || "Clean"}</span>
      </td>
      <td style={{ padding: '14px 12px', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', fontWeight: 600, verticalAlign: 'middle' }}>{action}</td>
    </tr>
  );
}

const verdictBoxStyle = (borderColor: string, bgColor: string, accentColor: string): React.CSSProperties => ({
  borderLeft: `5px solid ${borderColor}`,
  backgroundColor: bgColor,
  padding: '16px 20px',
  borderRadius: '0 12px 12px 0',
  border: `1px solid ${borderColor}`,
  borderLeftWidth: '5px'
});

const verdictLabelStyle = (color: string): React.CSSProperties => ({ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em', transform: 'translateY(-1px)' });
const verdictTextStyle = (color: string): React.CSSProperties => ({ margin: 0, fontSize: '14px', color, fontWeight: 600, lineHeight: '1.5' });