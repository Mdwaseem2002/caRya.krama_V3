"use client";
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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

  const appendBase64FileToPDF = async (
    pdf: jsPDF,
    dataUrl: string
  ): Promise<void> => {
    const isPdf   = dataUrl.startsWith('data:application/pdf') || dataUrl.includes(';base64,JVBER');
    const isImage = dataUrl.startsWith('data:image/');

    if (isPdf) {
      const base64 = dataUrl.split(',')[1];
      const binary  = atob(base64);
      const uint8   = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) uint8[i] = binary.charCodeAt(i);

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

    // ── Step 1: Render all inspection report pages ─────────────────────────
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
    const uploadedFiles: { dataUrl: string; label: string }[] = [];

    const inspectedFiles: { file: string; fileName: string }[] = (report as any)?.uploadedInspectedFiles || [];
    for (const f of inspectedFiles) {
      if (f.file) {
        uploadedFiles.push({ dataUrl: f.file, label: f.fileName || 'inspected-attachment' });
      }
    }

    if (report?.uploadedFile) {
      uploadedFiles.push({ dataUrl: report.uploadedFile, label: report.uploadedFileName || 'attachment' });
    }

    if (report?.carId && report.carId !== 'unlinked') {
      try {
        const allReports = await getAllInspectionReports(report.carId);
        const uploadedReports = allReports.filter(
          r => r.reportType === 'uploaded' && r.uploadedFile && r.id !== report.id
        );
        for (const ur of uploadedReports) {
          const urFiles: { file: string; fileName: string }[] = (ur as any).uploadedInspectedFiles || [];
          for (const f of urFiles) {
            if (f.file) uploadedFiles.push({ dataUrl: f.file, label: f.fileName || 'inspected-attachment' });
          }
          uploadedFiles.push({ dataUrl: ur.uploadedFile, label: ur.uploadedFileName || 'attachment' });
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
      }
    }

    pdf.save(`Inspection_Report_${report?.id || 'Download'}.pdf`);

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

  const hasProblemImages = report.inspectionImages && report.inspectionImages.length > 0;
  const problemImages: any[] = hasProblemImages ? (report.inspectionImages as any[]) : [];
  
  // If 1 or 2 problem images, they fit with generous room on Page 4 below Section 9.
  // If 3 or more images, Page 4 holds Sections 8 & 9, and separate gallery pages hold the images (up to 4 per page).
  const imagesOnPage4 = problemImages.length <= 2 ? problemImages : [];
  const separateImagePages = problemImages.length > 2 
    ? Array.from({ length: Math.ceil(problemImages.length / 4) }, (_, i) => problemImages.slice(i * 4, i * 4 + 4))
    : [];

  const totalPages = 4 + separateImagePages.length;

  return (
    <div style={{ backgroundColor: '#f3f4f6', padding: '40px 20px', minHeight: '100vh', textAlign: 'center' }}>
      <div ref={printRef} style={{ display: 'inline-block', textAlign: 'left' }}>
        
        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 1: EXECUTIVE OVERVIEW & CERTIFIED VEHICLE SUMMARY
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
            
            {/* BRAND HEADER — Logo + Official Contact */}
            <div style={{ border: '2px solid #0059A3', borderRadius: '12px', marginBottom: '18px', backgroundColor: '#ffffff', width: '100%', boxSizing: 'border-box', display: 'table', borderCollapse: 'separate' }}>
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', width: '50%', padding: '18px 20px', verticalAlign: 'middle', borderRight: '1px solid #e5e7eb', textAlign: 'center' }}>
                  <div style={{ width: '220px', height: '65px', margin: '0 auto 10px auto' }}>
                    <img
                      src={LOGO_BASE64}
                      alt="caRya.krama Logo"
                      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    />
                  </div>
                  <p style={{ margin: 0, fontSize: '9.5px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Professional Vehicle Inspection Services</p>
                </div>
                <div style={{ display: 'table-cell', width: '50%', padding: '18px 24px', verticalAlign: 'middle' }}>
                  <table style={{ borderCollapse: 'collapse', width: '100%', border: 'none' }}>
                    <tbody>
                      <tr>
                        <td style={{ paddingBottom: '10px', verticalAlign: 'middle', fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>caryakrama@gmail.com</td>
                      </tr>
                      <tr>
                        <td style={{ paddingBottom: '10px', verticalAlign: 'middle', fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>https://caryakrama.com/</td>
                      </tr>
                      <tr>
                        <td style={{ verticalAlign: 'middle', fontSize: '13.5px', fontWeight: 600, color: '#374151' }}>+91 99001 87847</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '2px', backgroundColor: '#0059A3', marginBottom: '16px' }}></div>
            
            {/* INSPECTION META BAR */}
            <div style={{ display: 'table', width: '100%', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '12px', borderCollapse: 'separate', overflow: 'hidden', marginBottom: '20px' }}>
              <div style={{ display: 'table-row' }}>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '14px', borderRight: '1px solid #e5e7eb', width: '33.33%' }}>
                   <p style={labelStyle}>Date</p>
                   <p style={valueStyle}>{new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '14px', borderRight: '1px solid #e5e7eb', width: '33.33%' }}>
                   <p style={labelStyle}>Inspection ID</p>
                   <p style={{ ...valueStyle, color: '#0059A3' }}>{report.id}</p>
                </div>
                <div style={{ display: 'table-cell', textAlign: 'center', padding: '14px', width: '33.33%' }}>
                   <p style={{ ...labelStyle, color: '#0059A3' }}>Inspector</p>
                   <p style={valueStyle}>{(report as any).inspectorName || "Z.K."}</p>
                </div>
              </div>
            </div>

            {/* VEHICLE OVERVIEW CARD */}
            <SectionCard title="Vehicle Overview"
              badge={
                <div style={{ display: 'inline-block', backgroundColor: '#ecfdf5', color: '#059669', padding: '4px 12px', border: '1px solid #a7f3d0', borderRadius: '20px', fontSize: '10.5px', fontWeight: 700, verticalAlign: 'middle' }}>
                  <span>✓ Verified Dealership</span>
                </div>
              }
            >
               <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '10px 18px', margin: '-10px -10px' }}>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', padding: '0 10px', width: '33.33%' }}>
                      <p style={labelStyle}>Make & Model</p>
                      <p style={valueStyle}>{report.vehicleDetails.carName}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 10px', width: '33.33%' }}>
                      <p style={labelStyle}>Year / Model</p>
                      <p style={valueStyle}>{report.vehicleDetails.year || "-"}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 10px', width: '33.33%' }}>
                      <p style={labelStyle}>Odometer</p>
                      <p style={valueStyle}>{report.vehicleDetails.odometer ? `${report.vehicleDetails.odometer} km` : "-"}</p>
                    </div>
                  </div>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', padding: '0 10px', width: '33.33%' }}>
                      <p style={labelStyle}>Seller Name</p>
                      <p style={{ ...valueStyle, color: '#374151' }}>{report.sellerDetails?.name || "caRya.krama"}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 10px', width: '33.33%' }}>
                      <p style={labelStyle}>Contact Number</p>
                      <p style={{ ...valueStyle, color: '#374151' }}>{report.sellerDetails?.contactNumber || "N/A"}</p>
                    </div>
                    <div style={{ display: 'table-cell', padding: '0 10px', width: '33.33%' }}>
                      <p style={labelStyle}>Location</p>
                      <p style={{ ...valueStyle, color: '#374151' }}>{(report.sellerDetails as any)?.location || "Bangalore, IN"}</p>
                    </div>
                  </div>
               </div>
            </SectionCard>

            {/* OVERALL VERDICT & EVALUATION CARD */}
            <SectionCard title="Overall Inspection Verdict & Evaluation">
               <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                  <div style={{ display: 'table-row' }}>
                     <div style={{ display: 'table-cell', ...verdictBoxStyle('#0059A3', '#f0f9ff', '#0369a1') }}>
                        <p style={verdictLabelStyle('#0059A3')}>Tyre Condition & Wear Status</p>
                        <p style={verdictTextStyle('#0369a1')}>{report.verdict?.mechanicalCondition || "Satisfactory"}</p>
                     </div>
                  </div>
                  <div style={{ display: 'table-row' }}>
                     <div style={{ display: 'table-cell', ...verdictBoxStyle('#059669', '#ecfdf5', '#047857') }}>
                        <p style={verdictLabelStyle('#059669')}>Purchase Recommendation</p>
                        <p style={{ ...verdictTextStyle('#047857'), fontSize: '15px', fontWeight: 800 }}>{report.verdict?.purchaseRecommendation || "Recommended"}</p>
                     </div>
                  </div>
               </div>

               {/* Official Certification Seal */}
               <div style={{ display: 'table', width: '100%', backgroundColor: '#f8fafc', padding: '14px 18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '16px', boxSizing: 'border-box' }}>
                 <div style={{ display: 'table-row' }}>
                   <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '36px' }}>
                     <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#0059A3', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 900 }}>✓</div>
                   </div>
                   <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft: '10px' }}>
                     <p style={{ margin: 0, fontSize: '11.5px', fontWeight: 800, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Certified caRya.krama Vehicle Inspection</p>
                     <p style={{ margin: '3px 0 0 0', fontSize: '11px', color: '#64748b', lineHeight: 1.45 }}>Multi-point digital inspection and physical diagnostic verification completed by certified automotive engineers.</p>
                   </div>
                 </div>
               </div>
            </SectionCard>

          </div>
          <Footer pageNum={1} totalPages={totalPages} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 2: EXTERIOR, BODY & MECHANICAL INSPECTION
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
            
            <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
               <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                     <span>EXTERIOR & MECHANICAL INSPECTION</span>
                  </div>
                  <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                     <span style={refStyle}>REF: {report.id}</span>
                  </div>
               </div>
            </div>

            {/* 1. BODY & VISUAL INSPECTION */}
            <SectionCard title="1. BODY & VISUAL INSPECTION">
              <PanelsGrid text={report.bodyInspection?.panelsChecked || "No observation"} />
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
            <SectionCard title="2. ENGINE BAY">
              <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                {report.engineBay || "No observations reported during engine bay inspection."}
              </p>
            </SectionCard>

            {/* 3. FLUIDS DEGRADATION */}
            <SectionCard title="3. FLUIDS DEGRADATION">
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
            </SectionCard>

          </div>
          <Footer pageNum={2} totalPages={totalPages} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 3: DIAGNOSTICS, CABIN & ROAD TEST EVALUATION
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
            
            <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
               <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                     <span>DIAGNOSTICS & ROAD TEST EVALUATION</span>
                  </div>
                  <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                     <span style={refStyle}>REF: {report.id}</span>
                  </div>
               </div>
            </div>

            {/* 4. BATTERY & ELECTRICAL */}
            <SectionCard title="4. BATTERY & ELECTRICAL">
               <div style={{ display: 'table', width: '100%', borderCollapse: 'separate', borderSpacing: '10px', margin: '-10px', marginTop: '2px' }}>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                       <p style={labelStyle}>Ignition</p>
                       <p style={batteryValueStyle}>{report.battery?.ignitionVoltage || "-"}</p>
                    </div>
                    <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                       <p style={labelStyle}>Cranking</p>
                       <p style={batteryValueStyle}>{report.battery?.crankingVoltage || "-"}</p>
                    </div>
                    <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                       <p style={labelStyle}>Charging</p>
                       <p style={batteryValueStyle}>{report.battery?.chargingVoltage || "-"}</p>
                    </div>
                    <div style={{ display: 'table-cell', ...batteryStatBoxStyle, width: '25%' }}>
                       <p style={labelStyle}>Load Range</p>
                       <p style={batteryValueStyle}>{report.battery?.loadRange || "-"}</p>
                    </div>
                  </div>
               </div>
               <div style={{ display: 'table', width: '100%', backgroundColor: report.battery?.systemWorking ? '#ecfdf5' : '#fef2f2', padding: '12px 16px', borderRadius: '10px', border: `1px solid ${report.battery?.systemWorking ? '#a7f3d0' : '#fecaca'}`, marginTop: '12px', boxSizing: 'border-box' }}>
                  <div style={{ display: 'table-row' }}>
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', width: '22px' }}>
                       <span style={{ color: report.battery?.systemWorking ? '#059669' : '#dc2626', fontWeight: 900, fontSize: '14px' }}>{report.battery?.systemWorking ? '✓' : '⚠'}</span>
                    </div>
                    <div style={{ display: 'table-cell', verticalAlign: 'middle', paddingLeft: '8px' }}>
                       <p style={{ margin: '0 0 2px 0', fontSize: '10px', color: report.battery?.systemWorking ? '#059669' : '#dc2626', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em' }}>System Health</p>
                       <p style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: report.battery?.systemWorking ? '#047857' : '#b91c1c' }}>{report.battery?.systemWorking ? "Battery & alternator charging system working properly" : "Charging system requires attention"}</p>
                    </div>
                  </div>
               </div>
            </SectionCard>

            {/* 5. INTERIORS & CABIN */}
            {report.interiors?.condition && (
              <SectionCard title="5. INTERIORS & CABIN">
                <p style={{ margin: 0, fontSize: '12.5px', color: '#374151', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                  {report.interiors.condition}
                </p>
              </SectionCard>
            )}

            {/* 6. TEST DRIVE OBSERVATIONS */}
            {report.testDrive && (
              <SectionCard title="6. TEST DRIVE OBSERVATIONS">
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
                <p style={{ margin: '0 0 6px 0', fontSize: '12px', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                  ⚠ Important Issues Requiring Attention
                </p>
                <p style={{ margin: 0, fontSize: '12.5px', color: '#991b1b', lineHeight: '1.55', fontWeight: 500, textAlign: 'justify' }}>
                  {report.interiors.issues}
                </p>
              </div>
            )}

          </div>
          <Footer pageNum={3} totalPages={totalPages} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            PAGE 4: ACTIONABLE RECOMMENDATIONS & VEHICLE EVIDENCE
        ═══════════════════════════════════════════════════════════════════════ */}
        <div className="pdf-page" style={pageStyle}>
          <div style={watermarkStyle}>caRya.krama</div>
          <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
            
            <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
               <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                     <span>ACTIONABLE RECOMMENDATIONS & EVIDENCE</span>
                  </div>
                  <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                     <span style={refStyle}>REF: {report.id}</span>
                  </div>
               </div>
            </div>

            {/* 8. PRECAUTIONS & RECOMMENDATIONS */}
            <SectionCard title="8. PRECAUTIONS & RECOMMENDATIONS">
               <BulletList text={report.precautions || "No generic precautions indicated."} warning={true} forceBullet={true} />
            </SectionCard>

            {/* 9. SERVICE RECOMMENDATIONS */}
            {report.serviceRecommendations && report.serviceRecommendations !== "-" && (
              <SectionCard title="9. SERVICE RECOMMENDATIONS">
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
                      <div key={i} style={{ backgroundColor: '#fff7f7', border: '1px solid #fecaca', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <img
                          src={url}
                          alt={`Evidence ${i + 1}`}
                          crossOrigin="anonymous"
                          style={{ width: '100%', height: imagesOnPage4.length === 1 ? '200px' : '160px', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ padding: '8px 12px', flex: 1 }}>
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
          <Footer pageNum={4} totalPages={totalPages} />
        </div>

        {/* ═══════════════════════════════════════════════════════════════════════
            EXTRA PAGES (FOR EXTENDED PROBLEM IMAGE GALLERIES IF >2 IMAGES)
        ═══════════════════════════════════════════════════════════════════════ */}
        {separateImagePages.map((pageImgs, pageImgIndex) => (
          <div key={`img-page-${pageImgIndex}`} className="pdf-page" style={pageStyle}>
            <div style={watermarkStyle}>caRya.krama</div>
            <div style={{ position: 'relative', zIndex: 1, flex: 1, overflow: 'hidden' }}>
              <div style={{ ...pageHeaderStyle, display: 'table', width: '100%' }}>
                <div style={{ display: 'table-row' }}>
                  <div style={{ display: 'table-cell', textAlign: 'left', verticalAlign: 'bottom' }}>
                    <span>INSPECTION PROBLEM IMAGES</span>
                  </div>
                  <div style={{ display: 'table-cell', textAlign: 'right', verticalAlign: 'bottom' }}>
                    <span style={refStyle}>REF: {report.id}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {pageImgs.map((img: any, i: number) => {
                  const url = typeof img === 'string' ? img : img?.url;
                  const desc = typeof img === 'string' ? '' : (img?.description || '');
                  const globalIdx = pageImgIndex * 4 + i + 1;
                  return (
                    <div key={i} style={{ backgroundColor: '#fff7f7', border: '1px solid #fecaca', borderRadius: '10px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <img
                        src={url}
                        alt={`Problem ${globalIdx}`}
                        crossOrigin="anonymous"
                        style={{ width: '100%', height: '180px', objectFit: 'cover', display: 'block' }}
                      />
                      <div style={{ padding: '8px 12px', flex: 1 }}>
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
            <Footer pageNum={4 + pageImgIndex + 1} totalPages={totalPages} />
          </div>
        ))}

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

const labelStyle: React.CSSProperties = { margin: '0 0 3px 0', fontSize: '10px', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' };
const valueStyle: React.CSSProperties = { margin: 0, fontSize: '14px', fontWeight: 800, color: '#111827' };
const pageHeaderStyle: React.CSSProperties = { margin: '0 0 16px 0', fontSize: '19px', fontWeight: 900, color: '#111827', borderBottom: '2px solid #0059A3', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' };
const refStyle: React.CSSProperties = { fontSize: '11.5px', color: '#6b7280', fontWeight: 600, letterSpacing: '0.05em' };
const batteryStatBoxStyle: React.CSSProperties = { backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px', border: '1px solid #e5e7eb' };
const batteryValueStyle: React.CSSProperties = { margin: 0, fontSize: '16px', fontWeight: 900, color: '#111827' };

function Footer({ pageNum, totalPages }: { pageNum: number, totalPages: number }) {
  return (
    <div style={{
      zIndex: 1,
      borderTop: '2px solid #f3f4f6',
      paddingTop: '12px',
      marginTop: 'auto',
      display: 'table',
      width: '100%',
      fontSize: '10.5px',
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
    <div style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '14px 18px', marginBottom: '12px' }}>
      <div style={{ display: 'table', width: '100%', borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '10px' }}>
         <div style={{ display: 'table-row' }}>
            <div style={{ display: 'table-cell', verticalAlign: 'middle' }}>
               <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: '1.2' }}>{title}</h3>
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

function PanelsGrid({ text }: { text?: string }) {
  if (!text) return <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>No observation</p>;
  const items = text.split('\n').map(s => s.trim()).filter(s => s.length > 0);
  const mid = Math.ceil(items.length / 2);
  const col1 = items.slice(0, mid);
  const col2 = items.slice(mid);

  const renderItem = (item: string, idx: number) => {
    const cleanItem = item.replace(/^(\d+[\.\-\)]\s*|[•\-\*]\s*)/, '');
    return (
      <div key={idx} style={{ display: 'table', width: '100%', marginBottom: '6px' }}>
        <div style={{ display: 'table-row' }}>
          <div style={{ display: 'table-cell', width: '18px', verticalAlign: 'top', color: '#059669', fontSize: '12px', fontWeight: 800, lineHeight: '1.3' }}>✓</div>
          <div style={{ display: 'table-cell', verticalAlign: 'top', fontSize: '12px', color: '#374151', lineHeight: '1.35', fontWeight: 500 }}>{cleanItem}</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'table', width: '100%' }}>
      <div style={{ display: 'table-row' }}>
        <div style={{ display: 'table-cell', width: '50%', verticalAlign: 'top', paddingRight: '10px' }}>
          {col1.map((it, i) => renderItem(it, i))}
        </div>
        <div style={{ display: 'table-cell', width: '50%', verticalAlign: 'top', paddingLeft: '10px' }}>
          {col2.map((it, i) => renderItem(it, i + mid))}
        </div>
      </div>
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
         const cleanBullet = bullet.replace(/^(\d+[\.\-\)]\s*|[•\-\*]\s*)/, '');
         return (
           <div key={i} style={{ display: 'table-row' }}>
              <div style={{ display: 'table-cell', width: '16px', verticalAlign: 'top', color: warning ? '#dc2626' : '#0059A3', fontSize: '12.5px', fontWeight: 800 }}>•</div>
              <div style={{ display: 'table-cell', verticalAlign: 'top' }}>
                 <p style={{ margin: 0, fontSize: '12.5px', color: warning ? '#991b1b' : '#374151', lineHeight: '1.5', fontWeight: 500 }}>
                    {cleanBullet}
                 </p>
              </div>
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

const verdictBoxStyle = (borderColor: string, bgColor: string, accentColor: string): React.CSSProperties => ({
  borderLeft: `5px solid ${borderColor}`,
  backgroundColor: bgColor,
  padding: '12px 16px',
  borderRadius: '0 10px 10px 0',
  border: `1px solid ${borderColor}`,
  borderLeftWidth: '5px'
});

const verdictLabelStyle = (color: string): React.CSSProperties => ({ margin: '0 0 4px 0', fontSize: '11.5px', fontWeight: 800, color, textTransform: 'uppercase', letterSpacing: '0.05em' });
const verdictTextStyle = (color: string): React.CSSProperties => ({ margin: 0, fontSize: '14px', color, fontWeight: 600, lineHeight: '1.45' });