"use client";

import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit3, Eye, FileText, Upload, ClipboardCheck, Download } from "lucide-react";
import { getAllInspectionReports, deleteInspectionReport, InspectionReportData } from "./InspectionStorage";
import InspectionReportForm from "./InspectionReportForm";
import InspectionReportUpload from "./InspectionReportUpload";
import InspectionReportPDFView from "./InspectionReportPDFView";
import { motion, AnimatePresence } from "framer-motion";

export default function InspectionReportsList() {
  const [reports, setReports] = useState<InspectionReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<"list" | "create" | "upload" | "view">("list");
  const [editReport, setEditReport] = useState<InspectionReportData | undefined>(undefined);
  const [viewReport, setViewReport] = useState<InspectionReportData | null>(null);

  const fetchReports = () => {
    setIsLoading(true);
    getAllInspectionReports()
      .then(setReports)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inspection report permanently?")) return;
    try {
      await deleteInspectionReport(id);
      fetchReports();
    } catch (err: any) {
      alert(`Failed to delete: ${err?.message || "Unknown error"}`);
    }
  };

  const handleDownload = (report: InspectionReportData) => {
    if (!report.uploadedFile) return;
    const link = document.createElement("a");
    link.href = report.uploadedFile;
    link.download = report.uploadedFileName || "inspection-report";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (view === "create") {
    return (
      <InspectionReportForm
        onBack={() => { setView("list"); setEditReport(undefined); }}
        onSuccess={() => { setView("list"); setEditReport(undefined); fetchReports(); }}
        editReport={editReport}
      />
    );
  }

  if (view === "upload") {
    return (
      <InspectionReportUpload
        onBack={() => setView("list")}
        onSuccess={() => { setView("list"); fetchReports(); }}
      />
    );
  }

  if (view === "view" && viewReport) {
    return (
      <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px' }}>
        <button onClick={() => { setView("list"); setViewReport(null); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#0059A3', fontWeight: 700, cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
          ← Back
        </button>

        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
          Inspection Report — {viewReport.carName}
        </h2>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
          ID: {viewReport.id} • Type: {viewReport.reportType === "created" ? "📝 Created" : "📄 Uploaded"} •
          Date: {new Date(viewReport.createdAt).toLocaleDateString()}
        </p>

        {viewReport.reportType === "uploaded" ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#f0f9ff', borderRadius: '16px', border: '1px solid #bae6fd' }}>
            <FileText size={48} style={{ color: '#0059A3', marginBottom: '16px' }} />
            <p style={{ fontWeight: 700, color: '#111827', marginBottom: '8px', fontSize: '16px' }}>{viewReport.uploadedFileName}</p>
            <button
              onClick={() => handleDownload(viewReport)}
              style={{ padding: '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} /> Download File
            </button>
          </div>
        ) : (
          <InspectionReportPDFView 
            report={viewReport} 
            onClose={() => { setView("list"); setViewReport(null); }} 
          />
        )}
      </div>
    );
  }

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  return (
    <div>
      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          onClick={() => { setEditReport(undefined); setView("create"); }}
          style={{ padding: '10px 20px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '10px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
        >
          <Plus size={16} /> Create Report
        </button>
        <button
          onClick={() => setView("upload")}
          style={{ padding: '10px 20px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '10px', fontWeight: 700, border: '1px solid #d1d5db', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
        >
          <Upload size={16} /> Upload Report
        </button>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {isLoading ? (
          <>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                <div className="skeleton-box" style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f3f4f6', backgroundImage: 'linear-gradient(90deg, #f3f4f6 0px, #e5e7eb 40px, #f3f4f6 80px)', backgroundSize: '200px 100%', animation: 'shimmerskeleton 1.5s infinite linear' }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ height: '14px', width: '50%', borderRadius: '4px', background: '#f3f4f6', backgroundImage: 'linear-gradient(90deg, #f3f4f6 0px, #e5e7eb 40px, #f3f4f6 80px)', backgroundSize: '200px 100%', animation: 'shimmerskeleton 1.5s infinite linear' }} />
                  <div style={{ height: '10px', width: '30%', borderRadius: '4px', background: '#f3f4f6', backgroundImage: 'linear-gradient(90deg, #f3f4f6 0px, #e5e7eb 40px, #f3f4f6 80px)', backgroundSize: '200px 100%', animation: 'shimmerskeleton 1.5s infinite linear' }} />
                </div>
              </div>
            ))}
            <style>{`@keyframes shimmerskeleton { 0% { background-position: -200px 0; } 100% { background-position: calc(200px + 100%) 0; } }`}</style>
          </>
        ) : reports.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
            <ClipboardCheck size={40} style={{ color: '#d1d5db', margin: '0 auto 16px' }} />
            <p style={{ color: '#6b7280', fontWeight: 600, margin: '0 0 4px' }}>No inspection reports yet</p>
            <p style={{ color: '#9ca3af', fontSize: '13px', margin: 0 }}>Create or upload your first report above.</p>
          </div>
        ) : (
          <AnimatePresence>
            {reports.map(report => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                  border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#F9FAFB'
                }}
              >
                <div style={{
                  width: '48px', height: '48px', borderRadius: '12px',
                  backgroundColor: report.reportType === "created" ? '#e0f2fe' : '#fef3c7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  {report.reportType === "created"
                    ? <ClipboardCheck size={22} style={{ color: '#0284c7' }} />
                    : <FileText size={22} style={{ color: '#d97706' }} />
                  }
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {report.carName || "Unnamed"}
                  </h4>
                  <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
                    {report.id} • {report.reportType === "created" ? "📝 Created" : "📄 Uploaded"}
                    {report.uploadedFileName ? ` • ${report.uploadedFileName}` : ""}
                    {" • "}{new Date(report.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  <button
                    onClick={() => { setViewReport(report); setView("view"); }}
                    title="View"
                    style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#0059A3', cursor: 'pointer' }}
                  ><Eye size={16} /></button>

                  {report.reportType === "created" && (
                    <button
                      onClick={() => { setEditReport(report); setView("create"); }}
                      title="Edit"
                      style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#6b7280', cursor: 'pointer' }}
                    ><Edit3 size={16} /></button>
                  )}

                  {report.reportType === "uploaded" && report.uploadedFile && (
                    <button
                      onClick={() => handleDownload(report)}
                      title="Download"
                      style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#10B981', cursor: 'pointer' }}
                    ><Download size={16} /></button>
                  )}

                  <button
                    onClick={() => handleDelete(report.id)}
                    title="Delete"
                    style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#EF4444', cursor: 'pointer' }}
                  ><Trash2 size={16} /></button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}


