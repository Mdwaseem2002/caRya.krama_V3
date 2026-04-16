"use client";

import React, { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { InspectionReportData, getInspectionReport } from "./InspectionStorage";

interface Props {
  reportId?: string;       // To fetch from DB natively
  initialReport?: InspectionReportData; // Or pass directly
  carCoverImage?: string;
  onClose?: () => void;
}

export default function InspectionReportDownload({ reportId, initialReport, carCoverImage, onClose }: Props) {
  const [report, setReport] = useState<InspectionReportData | null>(initialReport || null);
  const [loading, setLoading] = useState(!initialReport && !!reportId);
  const [error, setError] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  // Connect with mongoose backend data via API
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
       });
       
       const imgData = canvas.toDataURL("image/png");
       const imgHeight = (canvas.height * imgWidth) / canvas.width;
       
       if (i > 0) pdf.addPage();
       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
    }
    
    pdf.save(`Inspection_Report_${report?.id || 'Download'}.pdf`);
  };

  if (loading) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading Report Data...</div>;
  if (error) return <div style={{ padding: '40px', textAlign: 'center', color: 'red' }}>{error}</div>;
  if (!report) return null;

  const isWarning = (text: string) => {
    const l = text?.toLowerCase() || "";
    return l.includes("need") || l.includes("leak") || l.includes("damage") || l.includes("issue") || l.includes("attention");
  };

  // Safe PDF components breaking down everything to blocks/tables/inline-blocks over flex/grid
  const PageContainer = ({ children, pageNum }: { children: React.ReactNode, pageNum: number }) => (
    <div className="pdf-page" style={{ ...pageStyle, position: 'relative' }}>
      <div style={watermarkStyle}>caRya.krama</div>
      <div style={{ position: 'relative', zIndex: 1, minHeight: '940px' }}>
         {children}
      </div>
      {/* Footer strictly uses table for rigid columns without flex */}
      <div style={{ position: 'absolute', bottom: '50px', left: '60px', right: '60px', borderTop: '2px solid #f3f4f6', paddingTop: '16px', display: 'table', width: '674px', fontSize: '11px', color: '#9ca3af', fontWeight: 'bold' }}>
         <div style={{ display: 'table-cell', textAlign: 'left', width: '33%' }}>Page {pageNum} / 4</div>
         <div style={{ display: 'table-cell', textAlign: 'center', width: '33%', color: '#0059A3' }}>caRya.krama Vehicle Inspection</div>
         <div style={{ display: 'table-cell', textAlign: 'right', width: '33%' }}>{new Date().toLocaleDateString('en-GB')}</div>
      </div>
    </div>
  );

  const SectionBox = ({ title, icon, children }: { title: string, icon: string, children: React.ReactNode }) => (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff' }}>
      <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
         <span style={{ display: 'inline-block', fontSize: '18px', width: '28px', color: '#0059A3' }}>{icon}</span>
         <span style={{ display: 'inline-block', fontSize: '16px', fontWeight: 'bold', color: '#111827', verticalAlign: 'top', marginTop: '2px' }}>{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );

  const BulletList = ({ text, warn = false }: { text: string, warn?: boolean }) => {
    if (!text) return null;
    let bullets = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
    return (
      <div style={{ marginBottom: '12px' }}>
        {bullets.map((b, i) => {
          const w = warn || isWarning(b);
          return (
            <div key={i} style={{ marginBottom: '8px' }}>
              <span style={{ display: 'inline-block', width: '24px', verticalAlign: 'top', color: w ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                {w ? '⚠' : '✔'}
              </span>
              <span style={{ display: 'inline-block', width: 'calc(100% - 30px)', verticalAlign: 'top', fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
                {b}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '40px 20px', minHeight: '100vh', textAlign: 'center' }}>
      <div style={{ marginBottom: '32px', display: 'inline-block', width: '794px', backgroundColor: '#fff', padding: '16px 24px', borderRadius: '8px', border: '1px solid #e5e7eb', textAlign: 'left' }}>
         <span style={{ float: 'left' }}>
            {onClose && <button onClick={onClose} style={{ padding: '8px 16px', background: '#f3f4f6', border: '1px solid #ccc', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>← Back</button>}
         </span>
         <span style={{ float: 'right' }}>
            <button onClick={handleDownloadPDF} style={{ padding: '8px 16px', background: '#0059A3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>⇩ Download Clean PDF</button>
         </span>
         <div style={{ clear: 'both' }}></div>
      </div>

      <div ref={printRef} style={{ display: 'inline-block', textAlign: 'left' }}>
        {/* PAGE 1 */}
        <PageContainer pageNum={1}>
           {/* Top Boxed Header */}
           <div style={{ border: '2px solid #0059A3', borderRadius: '8px', padding: '20px', textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ margin: '0 0 4px 0', color: '#111827', fontSize: '26px' }}>caRya.<span style={{color: '#0059A3'}}>krama</span></h1>
              <div style={{ fontSize: '11px', color: '#6b7280', letterSpacing: '2px' }}>PROFESSIONAL VEHICLE INSPECTION SERVICES</div>
           </div>
           
           <div style={{ width: '100%', borderBottom: '2px solid #0059A3', marginBottom: '20px' }}></div>

           {/* Info Bar (Table layout avoids flex wrapping) */}
           <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '24px', textAlign: 'center' }}>
             <tbody>
               <tr>
                 <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb', width: '33%' }}>
                   <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>DATE</div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{new Date(report.createdAt).toLocaleDateString()}</div>
                 </td>
                 <td style={{ padding: '12px', borderRight: '1px solid #e5e7eb', width: '33%' }}>
                   <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>REPORT ID</div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{report.id}</div>
                 </td>
                 <td style={{ padding: '12px', width: '33%' }}>
                   <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>INSPECTOR NAME</div>
                   <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>Master Tech Z.K.</div>
                 </td>
               </tr>
             </tbody>
           </table>

           {/* Image */}
           <div style={{ width: '100%', height: '340px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '24px', textAlign: 'center', overflow: 'hidden' }}>
             {carCoverImage ? (
               <img src={carCoverImage} alt="Car" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
             ) : (
               <div style={{ paddingTop: '140px', color: '#9ca3af', fontSize: '40px' }}>🚗</div>
             )}
           </div>

           {/* Vehicle Details */}
           <SectionBox title="VEHICLE OVERVIEW" icon="🚘">
             <table style={{ width: '100%', marginBottom: report.sellerDetails ? '16px' : '0' }}>
               <tbody>
                 <tr>
                   <td style={{ width: '25%', padding: '0 8px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>MAKE & MODEL</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>{report.vehicleDetails.carName}</div>
                   </td>
                   <td style={{ width: '25%', padding: '0 8px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>YEAR / MODEL</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>{report.vehicleDetails.year || "-"}</div>
                   </td>
                   <td style={{ width: '25%', padding: '0 8px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>ODOMETER</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>{report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"}</div>
                   </td>
                   <td style={{ width: '25%', padding: '0 8px', verticalAlign: 'top' }}>
                      <div style={{ fontSize: '10px', color: '#0059A3', marginBottom: '4px', fontWeight: 'bold' }}>INSPECTION GOAL</div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0059A3' }}>STANDARD AUDIT</div>
                   </td>
                 </tr>
               </tbody>
             </table>
             {report.sellerDetails && (
               <div style={{ borderTop: '1px dashed #e5e7eb', paddingTop: '16px', marginTop: '8px' }}>
                 <table style={{ width: '100%' }}>
                   <tbody>
                     <tr>
                       <td style={{ width: '50%', padding: '0 8px' }}>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>SELLER NAME</div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>{report.sellerDetails.name || "-"}</div>
                       </td>
                       <td style={{ width: '50%', padding: '0 8px' }}>
                          <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>CONTACT NUMBER</div>
                          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>{report.sellerDetails.contactNumber || "-"}</div>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
             )}
           </SectionBox>
        </PageContainer>

        {/* PAGE 2 */}
        <PageContainer pageNum={2}>
           <div style={{ borderBottom: '2px solid #0059A3', paddingBottom: '12px', marginBottom: '24px' }}>
             <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>INSPECTION DETAILS</span>
             <span style={{ float: 'right', fontSize: '12px', color: '#6b7280', marginTop: '6px', fontWeight: 'bold' }}>REF: {report.id}</span>
             <div style={{ clear: 'both' }}></div>
           </div>

           <SectionBox title="1. BODY & VISUAL INSPECTION" icon="🔎">
              <BulletList text={report.bodyInspection.panelsChecked || "No observation"} />
              {report.bodyInspection.notes && report.bodyInspection.notes.trim() !== (report.engineBay || "").trim() && (
                <BulletList text={report.bodyInspection.notes} />
              )}
           </SectionBox>

           <SectionBox title="2. ENGINE BAY" icon="⚙">
              <BulletList text={report.engineBay || "No observations"} />
           </SectionBox>

           {report.interiors && (
             <SectionBox title="3. INTERIORS & CABIN" icon="🛋">
                <BulletList text={report.interiors.condition || "No interior observations"} />
                <BulletList text={report.interiors.issues} warn={true} />
             </SectionBox>
           )}
        </PageContainer>

        {/* PAGE 3 */}
        <PageContainer pageNum={3}>
           <div style={{ borderBottom: '2px solid #0059A3', paddingBottom: '12px', marginBottom: '24px' }}>
             <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>TECHNICAL DETAILS</span>
             <span style={{ float: 'right', fontSize: '12px', color: '#6b7280', marginTop: '6px', fontWeight: 'bold' }}>REF: {report.id}</span>
             <div style={{ clear: 'both' }}></div>
           </div>

           <SectionBox title="4. FLUIDS DEGRADATION & LEAKS" icon="💧">
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e5e7eb', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Fluid Type</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e5e7eb', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '2px solid #e5e7eb', fontSize: '12px', color: '#6b7280', textTransform: 'uppercase' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>Engine Oil</td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
                      <span style={{ color: isWarning(report.fluids.engineOil) ? '#d97706' : '#10b981', fontWeight: 'bold' }}>
                        {isWarning(report.fluids.engineOil) ? '⚠ ' : '✔ '}{report.fluids.engineOil || "Clean"}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', color: '#6b7280', fontWeight: 'bold' }}>{report.fluids.serviceNotes || "-"}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>Coolant / Antifreeze</td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
                      <span style={{ color: isWarning(report.fluids.coolant) ? '#d97706' : '#10b981', fontWeight: 'bold' }}>
                        {isWarning(report.fluids.coolant) ? '⚠ ' : '✔ '}{report.fluids.coolant || "Clean"}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', color: '#6b7280', fontWeight: 'bold' }}>-</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', fontWeight: 'bold', color: '#111827' }}>Brake Fluid</td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px' }}>
                      <span style={{ color: isWarning(report.fluids.brakeOil) ? '#d97706' : '#10b981', fontWeight: 'bold' }}>
                        {isWarning(report.fluids.brakeOil) ? '⚠ ' : '✔ '}{report.fluids.brakeOil || "Clean"}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', borderBottom: '1px solid #e5e7eb', fontSize: '13px', color: '#6b7280', fontWeight: 'bold' }}>-</td>
                  </tr>
                </tbody>
              </table>
           </SectionBox>

           <SectionBox title="5. BATTERY & ELECTRICAL" icon="⚡">
              <table style={{ width: '100%', marginBottom: '16px' }}>
                <tbody>
                  <tr>
                    <td style={{ width: '24%', verticalAlign: 'top', padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                       <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>IGNITION</div>
                       <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{report.battery.ignitionVoltage || "-"}</div>
                    </td>
                    <td style={{ width: '1%' }}></td>
                    <td style={{ width: '24%', verticalAlign: 'top', padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                       <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>CRANKING</div>
                       <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{report.battery.crankingVoltage || "-"}</div>
                    </td>
                    <td style={{ width: '1%' }}></td>
                    <td style={{ width: '24%', verticalAlign: 'top', padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                       <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>CHARGING</div>
                       <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{report.battery.chargingVoltage || "-"}</div>
                    </td>
                    <td style={{ width: '1%' }}></td>
                    <td style={{ width: '24%', verticalAlign: 'top', padding: '12px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }}>
                       <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '4px', fontWeight: 'bold' }}>LOAD RANGE</div>
                       <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#111827' }}>{report.battery.loadRange || "-"}</div>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div style={{ backgroundColor: report.battery.systemWorking ? '#ecfdf5' : '#fef2f2', padding: '16px', borderRadius: '6px', border: `1px solid ${report.battery.systemWorking ? '#a7f3d0' : '#fecaca'}` }}>
                 <span style={{ display: 'inline-block', fontSize: '18px', width: '30px', verticalAlign: 'top', color: report.battery.systemWorking ? '#059669' : '#dc2626' }}>
                    {report.battery.systemWorking ? '✔' : '⚠'}
                 </span>
                 <span style={{ display: 'inline-block', verticalAlign: 'top', width: 'calc(100% - 35px)' }}>
                    <div style={{ fontSize: '11px', fontWeight: 'bold', color: report.battery.systemWorking ? '#059669' : '#dc2626', marginBottom: '2px' }}>SYSTEM HEALTH</div>
                    <div style={{ fontSize: '13px', fontWeight: 'bold', color: report.battery.systemWorking ? '#047857' : '#b91c1c' }}>
                      {report.battery.systemWorking ? "Battery & alternator charging system working properly" : "Charging system requires attention"}
                    </div>
                 </span>
              </div>
           </SectionBox>

           <SectionBox title="6. OBD DIAGNOSTICS" icon="💻">
              <BulletList text={`Fault Codes: ${report.obdScan.faultCodes || "None detected"}`} warn={isWarning(report.obdScan.faultCodes)} />
              <BulletList text={`ECM Status: ${report.obdScan.ecmStatus || "No faults found in ECM"}`} warn={isWarning(report.obdScan.ecmStatus)} />
           </SectionBox>
        </PageContainer>

        {/* PAGE 4 */}
        <PageContainer pageNum={4}>
           <div style={{ borderBottom: '2px solid #0059A3', paddingBottom: '12px', marginBottom: '24px' }}>
             <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827' }}>ROAD TEST & FINAL SUMMARY</span>
             <span style={{ float: 'right', fontSize: '12px', color: '#6b7280', marginTop: '6px', fontWeight: 'bold' }}>REF: {report.id}</span>
             <div style={{ clear: 'both' }}></div>
           </div>

           {report.testDrive && (
             <SectionBox title="7. TEST DRIVE OBSERVATIONS" icon="🛣">
                <table style={{ width: '100%', marginBottom: '16px' }}>
                  <tbody>
                    <tr>
                      <td style={{ width: '50%', paddingRight: '12px', verticalAlign: 'top' }}>
                         <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Driving Performance</div>
                         <BulletList text={report.testDrive.performance || "Not evaluated"} warn={isWarning(report.testDrive.performance)} />
                      </td>
                      <td style={{ width: '50%', paddingLeft: '12px', verticalAlign: 'top' }}>
                         <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Braking & Stability</div>
                         <BulletList text={report.testDrive.braking || "Not evaluated"} warn={isWarning(report.testDrive.braking)} />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                   <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>Transmission & Suspension</div>
                   <BulletList text={report.testDrive.observations || "No specific observations"} />
                </div>
             </SectionBox>
           )}

           <SectionBox title="8. VERDICT SECTION" icon="🛡">
              <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #d1fae5', borderLeft: '5px solid #10b981', borderRadius: '4px' }}>
                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#065f46', marginBottom: '4px' }}>MECHANICALLY SOUND</div>
                 <div style={{ fontSize: '13px', color: '#064e3b', fontWeight: 'bold' }}>{report.verdict.mechanicalCondition || report.overallSummary?.mechanical || "-"}</div>
              </div>

              {report.overallSummary?.body && (
              <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderLeft: '5px solid #3b82f6', borderRadius: '4px' }}>
                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e40af', marginBottom: '4px' }}>BODY CONDITION SUMMARY</div>
                 <div style={{ fontSize: '13px', color: '#1e3a8a', fontWeight: 'bold' }}>{report.overallSummary.body}</div>
              </div>
              )}

              {report.verdict.issuesAttention && (
              <div style={{ marginBottom: '12px', padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderLeft: '5px solid #f59e0b', borderRadius: '4px' }}>
                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#92400e', marginBottom: '4px' }}>ISSUES REQUIRING ATTENTION</div>
                 <div style={{ fontSize: '13px', color: '#78350f', fontWeight: 'bold' }}>{report.verdict.issuesAttention}</div>
              </div>
              )}

              <div style={{ padding: '16px', backgroundColor: '#f0f9ff', border: '1px solid #e0f2fe', borderLeft: '5px solid #0059A3', borderRadius: '4px' }}>
                 <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#0059A3', marginBottom: '4px' }}>PURCHASE RECOMMENDATION</div>
                 <div style={{ fontSize: '14px', color: '#0369a1', fontWeight: 'bold' }}>{report.verdict.purchaseRecommendation || "Not Provided"}</div>
              </div>
           </SectionBox>

           <SectionBox title="9. PRECAUTIONS & RECOMMENDATIONS" icon="⚠">
              <BulletList text={report.precautions || "No generic precautions indicated."} />
              {(report.fluids?.serviceNotes && report.fluids.serviceNotes !== "-") && (
                 <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed #e5e7eb' }}>
                    <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px', textTransform: 'uppercase' }}>SERVICE RECOMMENDATIONS</div>
                    <BulletList text={report.fluids.serviceNotes} />
                 </div>
              )}
           </SectionBox>
        </PageContainer>
      </div>
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  width: '794px',
  height: '1123px', // EXACT A4
  backgroundColor: '#ffffff',
  padding: '50px 60px',
  boxSizing: 'border-box',
  fontFamily: 'Arial, Helvetica, sans-serif',
  pageBreakAfter: 'always',
  overflow: 'hidden',
  marginBottom: '24px' // Used for space between pages visually on screen
};

const watermarkStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%) rotate(-45deg)',
  fontSize: '110px',
  fontWeight: 'bold',
  color: '#0059A3',
  opacity: 0.03,
  whiteSpace: 'nowrap',
  zIndex: 0,
  pointerEvents: 'none'
};
