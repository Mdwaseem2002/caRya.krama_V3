"use client";

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download } from "lucide-react";
import { LOGO_BASE64 } from "./logoBase64";
import { InspectionReportData, getInspectionReport, getAllInspectionReports } from "./InspectionStorage";
import { addAdminNotification } from "@/Details/Notification/AdminNotify";

interface Props {
  reportId?: string;
  initialReport?: InspectionReportData;
  carCoverImage?: string;
  onClose?: () => void;
}

const isWarning = (text: string) => {
  const lText = text?.toLowerCase() || "";
  if (lText.includes("no fault") || lText.includes("none detected") || lText.includes("no issue") || lText.includes("no observation")) return false;
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

  // ── Helper: append a base64 data-URL file (PDF or image) as extra jsPDF pages
  const appendBase64FileToPDF = async (
    pdf: jsPDF,
    dataUrl: string
  ): Promise<void> => {
    const isPdf   = dataUrl.startsWith('data:application/pdf') || dataUrl.includes(';base64,JVBER');
    const isImage = dataUrl.startsWith('data:image/');

    if (isPdf) {
      // Convert base64 → Uint8Array without fetch
      const base64 = dataUrl.split(',')[1];
      const binary  = atob(base64);
      const uint8   = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) uint8[i] = binary.charCodeAt(i);

      // Avoid Next.js Webpack 'Module not found' issues by loading via CDN directly
      const pdfjsLib = await new Promise<any>((resolve, reject) => {
        if ((window as any).pdfjsLib) {
          resolve((window as any).pdfjsLib);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = () => {
          const loadedLib = (window as any).pdfjsLib;
          loadedLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          resolve(loadedLib);
        };
        script.onerror = () => reject(new Error('Failed to load pdf.js from CDN'));
        document.body.appendChild(script);
      });

      const pdfDoc = await pdfjsLib.getDocument({ data: uint8 }).promise;

      for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
        const pdfPage       = await pdfDoc.getPage(pageNum);
        const viewport      = pdfPage.getViewport({ scale: 1 });
        // Fit page into A4 (794 × 1123) at 2× DPI for crispness
        const scale         = Math.min(794 / viewport.width, 1123 / viewport.height) * 2;
        const scaledVP      = pdfPage.getViewport({ scale });

        const canvas        = document.createElement('canvas');
        canvas.width        = scaledVP.width;
        canvas.height       = scaledVP.height;
        const ctx           = canvas.getContext('2d')!;

        await pdfPage.render({ canvasContext: ctx, viewport: scaledVP } as any).promise;

        pdf.addPage();
        pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
      }

    } else if (isImage) {
      // Draw image centered on an A4 page
      const img = new window.Image();
      await new Promise<void>((res, rej) => {
        img.onload  = () => res();
        img.onerror = () => rej(new Error('Image load failed'));
        img.src     = dataUrl;
      });

      const canvas = document.createElement('canvas');
      canvas.width  = 794;
      canvas.height = 1123;
      const ctx     = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 794, 1123);

      const pad    = 40;
      const maxW   = 794 - pad * 2;
      const maxH   = 1123 - pad * 2;
      const ratio  = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
      const dW     = img.naturalWidth  * ratio;
      const dH     = img.naturalHeight * ratio;
      ctx.drawImage(img, (794 - dW) / 2, (1123 - dH) / 2, dW, dH);

      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, 0, 210, 297);
    }
  };

  const handleDownloadPDF = async () => {
    if (!printRef.current) return;
    const pages = printRef.current.querySelectorAll('.pdf-page');
    if (pages.length === 0) return;

    const pdf      = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;

    // ── Step 1: Render all 5 inspection report pages ─────────────────────────
    for (let i = 0; i < pages.length; i++) {
      const page   = pages[i] as HTMLElement;
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
        height: 1123,
        windowHeight: 1123,
        y: 0,
      } as any);

      const imgData   = canvas.toDataURL('image/jpeg', 0.85);
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    }

    // ── Step 2: Collect all files to append in the correct PDF order ──────────
    // PDF order: [Inspection Report pages] → [Upload Inspected] → [Upload Report]
    const uploadedFiles: { dataUrl: string; label: string }[] = [];

    // 2a. "Upload Inspected" — secondary file (PDF slot #2, between report & upload report)
    if ((report as any)?.uploadedInspectedFile) {
      uploadedFiles.push({
        dataUrl: (report as any).uploadedInspectedFile,
        label:   (report as any).uploadedInspectedFileName || 'inspected-attachment',
      });
    }

    // 2b. "Upload Report" — the primary uploaded file on THIS report (PDF slot #3)
    if (report?.uploadedFile) {
      uploadedFiles.push({
        dataUrl: report.uploadedFile,
        label:   report.uploadedFileName || 'attachment',
      });
    }

    // 2c. Fetch all "uploaded" type reports for the same car and collect their files (Upload Report)
    if (report?.carId && report.carId !== 'unlinked') {
      try {
        const allReports = await getAllInspectionReports(report.carId);
        const uploadedReports = allReports.filter(
          r => r.reportType === 'uploaded' && r.uploadedFile && r.id !== report.id
        );
        for (const ur of uploadedReports) {
          // Also prepend their uploadedInspectedFile if present
          if ((ur as any).uploadedInspectedFile) {
            uploadedFiles.push({
              dataUrl: (ur as any).uploadedInspectedFile,
              label:   (ur as any).uploadedInspectedFileName || 'inspected-attachment',
            });
          }
          uploadedFiles.push({
            dataUrl: ur.uploadedFile,
            label:   ur.uploadedFileName || 'attachment',
          });
        }
      } catch (fetchErr) {
        console.error('Could not fetch uploaded reports for car:', fetchErr);
      }
    }

    // ── Step 3: Append each collected file as extra PDF pages ─────────────────
    for (const file of uploadedFiles) {
      try {
        await appendBase64FileToPDF(pdf, file.dataUrl);
      } catch (appendErr) {
        console.error(`Failed to append "${file.label}" to PDF:`, appendErr);
        // Gracefully skip — base report is still intact
      }
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

  const issuesCount = report.interiors?.issues ? report.interiors.issues.split('\n').length : 0;
  const precCount = report.precautions ? report.precautions.split('\n').length : 0;
  const needsExtraPage = (issuesCount + precCount) > 10;
  const totalPages = needsExtraPage ? 6 : 5;

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '40px 20px', minHeight: '100vh', textAlign: 'center' }}>

      <div ref={printRef} style={{ display: 'inline-block', textAlign: 'left' }}>
        {/* PAGE 1 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
            {/* HEADER — Logo + Contact Info (matches web view) */}
            <div style={{ border: '2px solid #0059A3', borderRadius: '12px', marginBottom: '24px', backgroundColor: '#ffffff', width: '100%', boxSizing: 'border-box', display: 'table', borderCollapse: 'separate' }}>
              <div style={{ display: 'table-row' }}>
                {/* Left: Logo */}
                <div style={{ display: 'table-cell', width: '50%', padding: '24px', verticalAlign: 'middle', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <div style={{ width: '240px', height: '75px', margin: '0 auto 16px auto' }}>
                    <img
                      src={LOGO_BASE64}
                      alt="caRya.krama Logo"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                  <p style={{ margin: 0, fontSize: '10px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Professional Vehicle Inspection Services</p>
                </div>
                {/* Right: Contact Info */}
                <div style={{ display: 'table-cell', width: '50%', padding: '24px', verticalAlign: 'middle' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', border: 'none' }}>
                    <tbody>
                      <tr>
                        <td style={{ paddingBottom: '16px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          caryakrama@gmail.com
                        </td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '16px', verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          https://caryakrama.com/
                        </td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'middle', fontSize: '14px', fontWeight: 600, color: '#374151' }}>
                          +91 99001 87847
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
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
                   <p style={labelStyle}>ID</p>
                   <p style={valueStyle}>{report.id.split('-').pop()}</p>
                </div>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '16px', width: '33.33%' }}>
                   <p style={{ ...labelStyle, color: '#0059A3' }}>Inspector</p>
                   <p style={valueStyle}>{(report as any).inspectorName || "Z.K."}</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'table', width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', marginBottom: '24px', border: '1px solid #e5e7eb', backgroundColor: '#f8fafc' }}>
               <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'center' }}>
                    {/* Inspection images take priority over car media cover image */}
                    {(report.inspectionImages && report.inspectionImages.length > 0) || carCoverImage ? (
                      <img
                        src={(report.inspectionImages && report.inspectionImages.length > 0) ? report.inspectionImages[0] : carCoverImage}
                        alt="Car"
                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div style={{ color: '#cbd5e1' }}>No Image</div>
                    )}
                  </div>
               </div>
            </div>

            <SectionCard title="Vehicle Overview"
              badge={
                <div style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#059669', padding: '3px 12px 7px 12px', border: '1px solid #a7f3d0', borderRadius: '20px', fontSize: '10px', fontWeight: 700, verticalAlign: 'middle' }}>
                  <span style={{ position: 'relative', top: '-1px' }}>Verified Badge</span>
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
          <Footer pageNum={1} totalPages={totalPages} />
        </div>

        {/* PAGE 2 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
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

             <SectionCard title="3. INTERIORS & CABIN">
               <BulletList text={report.interiors.condition || "No interior observations"} warning={false} />
             </SectionCard>
          </div>
          <Footer pageNum={2} totalPages={totalPages} />
        </div>

        {/* PAGE 3 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
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

             <SectionCard title="4. FLUIDS DEGRADATION">
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

      {/* OBD Diagnostics removed */}
           </div>
           <Footer pageNum={3} totalPages={totalPages} />
         </div>

        {/* PAGE 4 */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
             <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                <div style={{ display: 'table-row' }}>
                   <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                      <span>DIAGNOSTICS & SUMMARY</span>
                   </div>
                   <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                      <span style={refStyle}>REF: {report.id}</span>
                   </div>
                </div>
             </div>

             {report.testDrive && (
             <SectionCard title="6. TEST DRIVE OBSERVATIONS">
                 <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '16px 0', marginLeft: '-16px' }}>
                    <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', width: '100%', paddingLeft: '16px' }}>
                        <p style={subHeaderStyle}>Driving Performance</p>
                        <BulletList text={report.testDrive.performance || "Not evaluated"} warning={isWarning(report.testDrive.performance)} />
                      </div>
                    </div>
                 </div>
             </SectionCard>
             )}

             <SectionCard title="7. VERDICT SECTION">
                <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                   <div style={{ display: 'table-row' }}>
                      <div style={{ display: 'table-cell', ...verdictBoxStyle('#0059A3', '#f0f9ff', '#0059A3') }}>
                        <p style={verdictLabelStyle('#0059A3')}>Purchase Recommendation</p>
                        <p style={{ ...verdictTextStyle('#0369a1'), fontSize: '15px', fontWeight: 800 }}>{report.verdict.purchaseRecommendation || "Not Provided"}</p>
                      </div>
                   </div>
                </div>
             </SectionCard>

           </div>
           <Footer pageNum={4} totalPages={totalPages} />
         </div>

         {/* PAGE 5 */}
         <div className="pdf-page" style={pageStyle}>
           <div style={watermarkStyle}>caRya.krama</div>
           <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
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

              {report.interiors?.issues && (
               <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.02em' }}>Important Issues</h3>
                <BulletList text={report.interiors.issues} warning={true} forceBullet={true} />
              </div>
              )}

              <SectionCard title="8. PRECAUTIONS & RECOMMENDATIONS">
                 <BulletList text={report.precautions || "No generic precautions indicated."} warning={true} forceBullet={true} />
              </SectionCard>

              {(!needsExtraPage && report.serviceRecommendations && report.serviceRecommendations !== "-") && (
              <SectionCard title="9. SERVICE RECOMMENDATIONS">
                 <BulletList text={report.serviceRecommendations} warning={false} forceBullet={true} />
              </SectionCard>
              )}

           </div>
           <Footer pageNum={5} totalPages={totalPages} />
         </div>

         {/* OPTIONAL PAGE 6 FOR OVERFLOWING SERVICE RECOMMENDATIONS */}
         {needsExtraPage && (
         <div className="pdf-page" style={pageStyle}>
           <div style={watermarkStyle}>caRya.krama</div>
           <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
              <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                 <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                       <span>SERVICE RECOMMENDATIONS</span>
                    </div>
                    <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                       <span style={refStyle}>REF: {report.id}</span>
                    </div>
                 </div>
              </div>

              {(report.serviceRecommendations && report.serviceRecommendations !== "-") && (
              <SectionCard title="9. SERVICE RECOMMENDATIONS">
                 <BulletList text={report.serviceRecommendations} warning={false} forceBullet={true} />
              </SectionCard>
              )}

           </div>
           <Footer pageNum={6} totalPages={totalPages} />
         </div>
         )}
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
  padding: '40px 50px 30px 50px',
  boxSizing: 'border-box',
  fontFamily: '"Inter", Arial, sans-serif',
  position: 'relative',
  pageBreakAfter: 'always',
  overflow: 'hidden',
  marginBottom: '24px',
  boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  display: 'flex',
  flexDirection: 'column',
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

const labelStyle: React.CSSProperties = { margin: '0 0 4px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' };
const valueStyle: React.CSSProperties = { margin: 0, fontSize: '14px', fontWeight: 800, color: '#111827' };
const pageHeaderStyle: React.CSSProperties = { margin: '0 0 16px 0', fontSize: '20px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' };
const refStyle: React.CSSProperties = { fontSize: '12px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' };
const subHeaderStyle: React.CSSProperties = { margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#374151', textTransform: 'uppercase' };
const batteryStatBoxStyle: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e5e7eb' };
const batteryValueStyle: React.CSSProperties = { margin: 0, fontSize: '17px', fontWeight: 900, color: '#111827' };

function Footer({ pageNum, totalPages }: { pageNum: number, totalPages: number }) {
  return (
    <div style={{
      zIndex: 1,
      borderTop: '2px solid #f3f4f6',
      paddingTop: '12px',
      marginTop: 'auto',
      display: 'table',
      width: '100%',
      fontSize: '11px',
      color: '#9ca3af',
      fontWeight: 700,
      flexShrink: 0,
    }}>
      <div style={{ display: 'table-row' }}>
         <div style={{ display: 'table-cell', textAlign: 'left', width: '33.3%' }}>Page {pageNum} / {totalPages}</div>
         <div style={{ display: 'table-cell', textAlign: 'center', width: '33.3%', color: '#0059A3', fontWeight: 900, letterSpacing: '0.05em' }}>caRya.krama Vehicle Inspection</div>
         <div style={{ display: 'table-cell', textAlign: 'right', width: '33.3%' }}>Confidential</div>
      </div>
    </div>
  );
}

function SectionCard({ title, children, badge }: { title: string, children: React.ReactNode, badge?: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '16px', marginBottom: '16px' }}>
      <div style={{ display: 'table', width: '100%', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '12px' }}>
         <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
               <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '1.2' }}>{title}</h3>
            </div>
            {badge && (
              <div style={{ display: 'table-cell', verticalAlign: 'middle', textAlign: 'right', whiteSpace: 'nowrap' }}>
                 {badge}
              </div>
            )}
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
    <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', marginTop: '4px' }}>
      {bullets.map((bullet, i) => {
         const isWarn = warning;
         return (
           <div key={i} style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
                 <p style={{ margin: 0, fontSize: '14px', color: isWarn ? '#991b1b' : '#374151', lineHeight: '1.6', fontWeight: 600 }}>
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
         <span style={{ fontSize: '14px', fontWeight: 800, color: '#374151' }}>{status || "Clean"}</span>
      </td>
      <td style={{ padding: '14px 12px', fontSize: '13px', color: '#6b7280', borderBottom: '1px solid #e5e7eb', fontWeight: 600, verticalAlign: 'middle' }}>{action}</td>
    </tr>
  );
}

const verdictBoxStyle = (borderColor: string, bgColor: string, accentColor: string): React.CSSProperties => ({
  borderLeft: `5px solid ${borderColor}`,
  backgroundColor: bgColor,
  padding: '12px 16px',
  borderRadius: '0 12px 12px 0',
  border: `1px solid ${borderColor}`,
  borderLeftWidth: '5px'
});

const verdictLabelStyle = (color: string): React.CSSProperties => ({ margin: '0 0 4px 0', fontSize: '12px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em', transform: 'translateY(-1px)' });
const verdictTextStyle = (color: string): React.CSSProperties => ({ margin: 0, fontSize: '14px', color, fontWeight: 600, lineHeight: '1.5' });