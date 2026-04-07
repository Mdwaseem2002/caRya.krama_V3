"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Upload, FileUp, X, Save, FileText, FileSpreadsheet, File } from "lucide-react";
import { saveInspectionReport } from "./InspectionStorage";

interface InspectionReportUploadProps {
  onBack: () => void;
  onSuccess: () => void;
  carId?: string;
  carName?: string;
}

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
];

const ACCEPT_STRING = ".pdf,.xlsx,.xls,.docx,.doc";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function getFileIcon(name: string) {
  if (name.endsWith(".pdf")) return <FileText size={24} style={{ color: '#EF4444' }} />;
  if (name.endsWith(".xlsx") || name.endsWith(".xls")) return <FileSpreadsheet size={24} style={{ color: '#10B981' }} />;
  if (name.endsWith(".docx") || name.endsWith(".doc")) return <File size={24} style={{ color: '#3B82F6' }} />;
  return <FileUp size={24} style={{ color: '#6b7280' }} />;
}

export default function InspectionReportUpload({
  onBack, onSuccess, carId, carName
}: InspectionReportUploadProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string>("");
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [inputCarId, setInputCarId] = useState(carId || "");
  const [reportCarName, setReportCarName] = useState(carName || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Unsupported file format. Please upload PDF, Excel, or Word documents.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      alert("File too large. Maximum allowed size is 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedFile(reader.result as string);
      setUploadedFileName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      alert("Please upload a file first.");
      return;
    }
    if (!reportCarName) {
      alert("Please enter the car name.");
      return;
    }

    setIsSaving(true);
    try {
      await saveInspectionReport({
        carId: inputCarId || "unlinked",
        carName: reportCarName,
        reportType: "uploaded",
        vehicleDetails: { carName: reportCarName, year: "", odometer: "" },
        bodyInspection: { panelsChecked: "", notes: "" },
        engineBay: "",
        fluids: { engineOil: "", coolant: "", brakeOil: "", serviceNotes: "" },
        battery: {
          ignitionVoltage: "", crankingVoltage: "", chargingVoltage: "",
          loadRange: "", systemWorking: false
        },
        interiors: { condition: "", issues: "" },
        obdScan: { faultCodes: "", ecmStatus: "" },
        testDrive: { performance: "", braking: "", observations: "" },
        overallSummary: { mechanical: "", body: "" },
        verdict: { mechanicalCondition: "", issuesAttention: "", purchaseRecommendation: "" },
        precautions: "",
        uploadedFile,
        uploadedFileName,
      });
      onSuccess();
    } catch (err: any) {
      alert(`Failed to upload report: ${err?.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '32px' }}>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#0059A3', fontWeight: 700, cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
        📄 Upload Inspection Report
      </h2>
      <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
        Upload a PDF, Excel, or Word document as the inspection report.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Stock ID / Vehicle ID</label>
          <input
            value={inputCarId}
            onChange={e => setInputCarId(e.target.value)}
            placeholder="e.g. CK-1234567"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>Car Name *</label>
          <input
            value={reportCarName}
            onChange={e => setReportCarName(e.target.value)}
            placeholder="e.g. Baleno RS 2018"
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
          />
        </div>
      </div>

      {/* Upload Zone */}
      {!uploadedFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            width: '100%', padding: '60px 20px', border: '2px dashed #d1d5db',
            borderRadius: '16px', textAlign: 'center', backgroundColor: '#f9fafb',
            cursor: 'pointer', transition: 'border-color 0.2s', marginBottom: '24px'
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#0059A3')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = '#d1d5db')}
        >
          <Upload size={40} style={{ color: '#9ca3af', margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 700, color: '#4b5563', margin: '0 0 8px', fontSize: '16px' }}>
            Click to upload inspection document
          </p>
          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
            Supported formats: PDF, Excel (.xlsx, .xls), Word (.docx, .doc) — Max 10MB
          </p>
          <input
            type="file"
            ref={fileInputRef}
            accept={ACCEPT_STRING}
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
      ) : (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd',
          borderRadius: '12px', marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {getFileIcon(uploadedFileName)}
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>{uploadedFileName}</p>
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>Ready to upload</p>
            </div>
          </div>
          <button
            onClick={() => { setUploadedFile(""); setUploadedFileName(""); }}
            style={{ padding: '8px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', color: '#EF4444' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Submit */}
      <div style={{
        display: 'flex', gap: '16px', paddingTop: '16px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <button
          onClick={onBack}
          style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '12px', fontWeight: 700, border: '1px solid #d1d5db', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving || !uploadedFile}
          style={{
            padding: '12px 32px', backgroundColor: '#0059A3', color: '#ffffff',
            borderRadius: '12px', fontWeight: 700, border: 'none',
            cursor: (isSaving || !uploadedFile) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 14px rgba(0, 89, 163, 0.3)',
            opacity: (isSaving || !uploadedFile) ? 0.5 : 1
          }}
        >
          <Save size={18} /> {isSaving ? 'Uploading...' : 'Save Report'}
        </button>
      </div>
    </div>
  );
}
