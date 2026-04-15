"use client";

import React, { useState } from "react";
import {
  ArrowLeft, Save, Search, FileText, Settings, Droplets,
  Battery, Armchair, Cpu, CarFront, CheckCircle, AlertTriangle,
  ShieldAlert
} from "lucide-react";
import { saveInspectionReport, updateInspectionReport, InspectionReportData } from "./InspectionStorage";

interface InspectionReportFormProps {
  onBack: () => void;
  onSuccess: () => void;
  carId?: string;
  carName?: string;
  year?: string;
  odometer?: string;
  editReport?: InspectionReportData;
}

export default function InspectionReportForm({
  onBack, onSuccess, carId, carName, year, odometer, editReport
}: InspectionReportFormProps) {
  const [isSaving, setIsSaving] = useState(false);

  // Vehicle Details
  const [inputCarId, setInputCarId] = useState(editReport?.carId || carId || "");
  const [vdCarName, setVdCarName] = useState(editReport?.vehicleDetails?.carName || carName || "");
  const [vdYear, setVdYear] = useState(editReport?.vehicleDetails?.year || year || "");
  const [vdOdometer, setVdOdometer] = useState(editReport?.vehicleDetails?.odometer || odometer || "");

  // Body & Visual Inspection
  const [bodyPanels, setBodyPanels] = useState(editReport?.bodyInspection?.panelsChecked || "");
  const [bodyNotes, setBodyNotes] = useState(editReport?.bodyInspection?.notes || "");

  // Engine Bay
  const [engineBay, setEngineBay] = useState(editReport?.engineBay || "");

  // Fluids
  const [engineOil, setEngineOil] = useState(editReport?.fluids?.engineOil || "");
  const [coolant, setCoolant] = useState(editReport?.fluids?.coolant || "");
  const [brakeOil, setBrakeOil] = useState(editReport?.fluids?.brakeOil || "");
  const [fluidServiceNotes, setFluidServiceNotes] = useState(editReport?.fluids?.serviceNotes || "");

  // Battery
  const [ignitionVoltage, setIgnitionVoltage] = useState(editReport?.battery?.ignitionVoltage || "");
  const [crankingVoltage, setCrankingVoltage] = useState(editReport?.battery?.crankingVoltage || "");
  const [chargingVoltage, setChargingVoltage] = useState(editReport?.battery?.chargingVoltage || "");
  const [loadRange, setLoadRange] = useState(editReport?.battery?.loadRange || "");
  const [batteryWorking, setBatteryWorking] = useState(editReport?.battery?.systemWorking || false);

  // Interiors
  const [interiorsCondition, setInteriorsCondition] = useState(editReport?.interiors?.condition || "");
  const [interiorsIssues, setInteriorsIssues] = useState(editReport?.interiors?.issues || "");

  // OBD Scan
  const [faultCodes, setFaultCodes] = useState(editReport?.obdScan?.faultCodes || "");
  const [ecmStatus, setEcmStatus] = useState(editReport?.obdScan?.ecmStatus || "");

  // Test Drive
  const [drivePerformance, setDrivePerformance] = useState(editReport?.testDrive?.performance || "");
  const [driveBraking, setDriveBraking] = useState(editReport?.testDrive?.braking || "");
  const [driveObservations, setDriveObservations] = useState(editReport?.testDrive?.observations || "");

  // Overall Summary
  const [summaryMechanical, setSummaryMechanical] = useState(editReport?.overallSummary?.mechanical || "");
  const [summaryBody, setSummaryBody] = useState(editReport?.overallSummary?.body || "");

  // Verdict
  const [verdictMechanical, setVerdictMechanical] = useState(editReport?.verdict?.mechanicalCondition || "");
  const [verdictIssues, setVerdictIssues] = useState(editReport?.verdict?.issuesAttention || "");
  const [verdictRecommendation, setVerdictRecommendation] = useState(editReport?.verdict?.purchaseRecommendation || "");

  // Precautions
  const [precautions, setPrecautions] = useState(editReport?.precautions || "");

  // Seller Details
  const [sellerName, setSellerName] = useState(editReport?.sellerDetails?.name || "");
  const [sellerContact, setSellerContact] = useState(editReport?.sellerDetails?.contactNumber || "");

  // ── Styles ──────────────────────────────────────────────────────────────────
  const sectionStyle: React.CSSProperties = { marginBottom: '32px' };
  const sectionHeaderStyle: React.CSSProperties = {
    fontSize: '16px', fontWeight: 700, color: '#374151',
    marginBottom: '16px', borderBottom: '2px solid #e5e7eb',
    paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px'
  };
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '12px', fontWeight: 700,
    color: '#6b7280', marginBottom: '4px'
  };
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px', borderRadius: '8px',
    border: '1px solid #d1d5db', outline: 'none', boxSizing: 'border-box',
    fontSize: '14px', fontWeight: 500
  };
  const textareaStyle: React.CSSProperties = {
    ...inputStyle, minHeight: '120px', resize: 'vertical' as const,
    fontFamily: 'inherit', lineHeight: '1.6'
  };
  const gridTwoStyle: React.CSSProperties = {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'
  };

  const handleSubmit = async () => {
    if (!vdCarName) {
      alert("Please enter the car name in Vehicle Details.");
      return;
    }

    setIsSaving(true);
    try {
      const reportData = {
        carId: inputCarId || "unlinked",
        carName: vdCarName,
        reportType: "created" as const,
        vehicleDetails: { carName: vdCarName, year: vdYear, odometer: vdOdometer },
        bodyInspection: { panelsChecked: bodyPanels, notes: bodyNotes },
        engineBay,
        fluids: { engineOil, coolant, brakeOil, serviceNotes: fluidServiceNotes },
        battery: {
          ignitionVoltage, crankingVoltage, chargingVoltage,
          loadRange, systemWorking: batteryWorking
        },
        interiors: { condition: interiorsCondition, issues: interiorsIssues },
        obdScan: { faultCodes, ecmStatus },
        testDrive: { performance: drivePerformance, braking: driveBraking, observations: driveObservations },
        overallSummary: { mechanical: summaryMechanical, body: summaryBody },
        verdict: {
          mechanicalCondition: verdictMechanical,
          issuesAttention: verdictIssues,
          purchaseRecommendation: verdictRecommendation
        },
        precautions,
        sellerDetails: {
          name: sellerName,
          contactNumber: sellerContact
        },
        uploadedFile: "",
        uploadedFileName: "",
      };

      if (editReport) {
        await updateInspectionReport(editReport.id, reportData);
      } else {
        await saveInspectionReport(reportData);
      }

      // Trigger Admin Notification
      if (typeof window !== "undefined") {
        import("@/Details/Notification/AdminNotify").then(({ addAdminNotification }) => {
          addAdminNotification({
            title: "Report Generated 📄",
            message: `Inspection report for ${vdCarName} created successfully.`,
            type: "report"
          });
        });
      }

      onSuccess();
    } catch (err: any) {
      alert(`Failed to save report: ${err?.message || "Unknown error"}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-6 md:p-8">
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#0059A3', fontWeight: 700, cursor: 'pointer', marginBottom: '24px', padding: 0 }}>
        <ArrowLeft size={16} /> Back
      </button>

      <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-2 flex items-center gap-2">
        {editReport ? 'Edit Inspection Report' : (
          <>
            <Search size={24} className="text-blue-600" />
            <span>Vehicle Inspection Report</span>
          </>
        )}
      </h2>
      {carName && (
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '32px' }}>
          Creating report for: <strong style={{ color: '#0059A3' }}>{carName}</strong>
        </p>
      )}

      {/* ── 1. Vehicle Details ─────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <Search size={18} style={{ color: '#0059A3' }} /> Vehicle Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label style={labelStyle}>Stock ID / Vehicle ID {carId && <span style={{ color: '#10B981', fontSize: '11px', fontWeight: 800, marginLeft: '6px' }}>✓ Auto-linked</span>}</label>
            <input 
              value={inputCarId} 
              onChange={e => !carId && setInputCarId(e.target.value)} 
              placeholder="e.g. CK-1234567" 
              readOnly={!!carId}
              style={{ 
                ...inputStyle, 
                backgroundColor: carId ? '#f0fdf4' : 'white',
                borderColor: carId ? '#bbf7d0' : '#d1d5db',
                color: carId ? '#166534' : '#111827',
                fontWeight: carId ? 700 : 500,
                cursor: carId ? 'not-allowed' : 'text'
              }} 
            />
          </div>
          <div>
            <label style={labelStyle}>Car Name *</label>
            <input value={vdCarName} onChange={e => setVdCarName(e.target.value)} placeholder="e.g. Baleno" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Year</label>
            <input value={vdYear} onChange={e => setVdYear(e.target.value)} placeholder="e.g. 2018" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Odometer (KM)</label>
            <input value={vdOdometer} onChange={e => setVdOdometer(e.target.value)} placeholder="e.g. 84000" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* ── 1.5 Seller Details ─────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <ShieldAlert size={18} style={{ color: '#0059A3' }} /> Seller Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Seller Name</label>
            <input value={sellerName} onChange={e => setSellerName(e.target.value)} placeholder="e.g. John Doe / Dealership Name" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Seller Contact Number</label>
            <input value={sellerContact} onChange={e => setSellerContact(e.target.value)} placeholder="e.g. +91 9876543210" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* ── 2. Body & Visual Inspection ────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <FileText size={18} style={{ color: '#0059A3' }} /> Body & Visual Inspection
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Body Panels Checked</label>
          <textarea
            value={bodyPanels}
            onChange={e => setBodyPanels(e.target.value)}
            placeholder={"Front bumper\nRight headlight\nRight and left front fenders\nDriver's door, left rear door, right rear door, and bonnet\nRear dicky\nLeft rear fender and right rear door"}
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Inspection Notes</label>
          <textarea
            value={bodyNotes}
            onChange={e => setBodyNotes(e.target.value)}
            placeholder={"Bumpers and some body parts repainted. Overall body is in good shape and condition.\nBoot door repainted. Minor cosmetic touch up done. No impact on safety."}
            style={textareaStyle}
          />
        </div>
      </section>

      {/* ── 3. Engine Bay ──────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <Settings size={18} style={{ color: '#0059A3' }} /> Engine Bay
        </h3>
        <div>
          <label style={labelStyle}>Engine Bay Observations</label>
          <textarea
            value={engineBay}
            onChange={e => setEngineBay(e.target.value)}
            placeholder={"No oil spills or accidental damage\nAll pipes are good\nMinor tampering observed in wiring\nBelt condition OK\nAprons are in good shape"}
            style={textareaStyle}
          />
        </div>
      </section>

      {/* ── 4. Fluids ──────────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <Droplets size={18} style={{ color: '#0059A3' }} /> Fluids
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Engine Oil</label>
            <input value={engineOil} onChange={e => setEngineOil(e.target.value)} placeholder="Condition / level" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Coolant</label>
            <input value={coolant} onChange={e => setCoolant(e.target.value)} placeholder="Condition / level" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Brake Oil</label>
            <input value={brakeOil} onChange={e => setBrakeOil(e.target.value)} placeholder="Condition / level" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Service Notes</label>
            <input value={fluidServiceNotes} onChange={e => setFluidServiceNotes(e.target.value)} placeholder="e.g. All needs to be serviced" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* ── 5. Battery ─────────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <Battery size={18} style={{ color: '#0059A3' }} /> Battery
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Ignition Voltage</label>
            <input value={ignitionVoltage} onChange={e => setIgnitionVoltage(e.target.value)} placeholder="e.g. 12.50V" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Cranking Voltage</label>
            <input value={crankingVoltage} onChange={e => setCrankingVoltage(e.target.value)} placeholder="e.g. 10.4V" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Charging Voltage</label>
            <input value={chargingVoltage} onChange={e => setChargingVoltage(e.target.value)} placeholder="e.g. 14.4V" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Load Range</label>
            <input value={loadRange} onChange={e => setLoadRange(e.target.value)} placeholder="e.g. 13.8V – 14.2V" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
          <input type="checkbox" checked={batteryWorking} onChange={e => setBatteryWorking(e.target.checked)} id="batteryCheck" style={{ width: '18px', height: '18px' }} />
          <label htmlFor="batteryCheck" style={{ fontSize: '14px', fontWeight: 700, color: '#166534', cursor: 'pointer' }}>
            ✔ Battery & alternator charging system working properly
          </label>
        </div>
      </section>

      {/* ── 6. Interiors ───────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <Armchair size={18} style={{ color: '#0059A3' }} /> Interiors
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <label style={labelStyle}>Interior Condition</label>
          <textarea
            value={interiorsCondition}
            onChange={e => setInteriorsCondition(e.target.value)}
            placeholder={"Seats are good\nSteering infotainment, instrument cluster, and AC all functional\nSeat belts in good condition\nRear seats and flooring are good"}
            style={textareaStyle}
          />
        </div>
        <div>
          <label style={{ ...labelStyle, color: '#DC2626' }}>⚠ Important Issues</label>
          <textarea
            value={interiorsIssues}
            onChange={e => setInteriorsIssues(e.target.value)}
            placeholder="e.g. AC COMPRESSOR NOT WORKING AND REAR BOOT SPACE PLASTIC COMPONENTS NEEDS TO BE REFIXED"
            style={{ ...textareaStyle, borderColor: '#fca5a5', backgroundColor: '#fef2f2' }}
          />
        </div>
      </section>

      {/* ── 7. OBD Scan ────────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <Cpu size={18} style={{ color: '#0059A3' }} /> OBD Scan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Fault Codes Notes</label>
            <textarea
              value={faultCodes}
              onChange={e => setFaultCodes(e.target.value)}
              placeholder="e.g. Minor fault codes were present and healed"
              style={{ ...textareaStyle, minHeight: '80px' }}
            />
          </div>
          <div>
            <label style={labelStyle}>ECM Status</label>
            <textarea
              value={ecmStatus}
              onChange={e => setEcmStatus(e.target.value)}
              placeholder="e.g. No faults found in ECM"
              style={{ ...textareaStyle, minHeight: '80px' }}
            />
          </div>
        </div>
      </section>

      {/* ── 8. Test Drive Observations ─────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <CarFront size={18} style={{ color: '#0059A3' }} /> Test Drive Observations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label style={labelStyle}>Driving Performance</label>
            <input value={drivePerformance} onChange={e => setDrivePerformance(e.target.value)} placeholder="e.g. Driving performance is OK" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Braking & Stability</label>
            <input value={driveBraking} onChange={e => setDriveBraking(e.target.value)} placeholder="e.g. Braking and stability OK" style={inputStyle} />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Clutch / Turbo / Drive Shaft / Suspension Observations</label>
          <textarea
            value={driveObservations}
            onChange={e => setDriveObservations(e.target.value)}
            placeholder="e.g. Clutch is little hard, turbo core sound, drive shaft noisy. Suspension is OK"
            style={{ ...textareaStyle, minHeight: '80px' }}
          />
        </div>
      </section>

      {/* ── 9. Overall Summary ─────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <CheckCircle size={18} style={{ color: '#10B981' }} /> Overall Summary
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Mechanical Condition</label>
            <textarea
              value={summaryMechanical}
              onChange={e => setSummaryMechanical(e.target.value)}
              placeholder="e.g. Baleno RS is mechanically sound OK in condition"
              style={{ ...textareaStyle, minHeight: '80px' }}
            />
          </div>
          <div>
            <label style={labelStyle}>Body Condition Summary</label>
            <textarea
              value={summaryBody}
              onChange={e => setSummaryBody(e.target.value)}
              placeholder="e.g. Body shows mild paint correction with no accident repair"
              style={{ ...textareaStyle, minHeight: '80px' }}
            />
          </div>
        </div>
      </section>

      {/* ── 10. Verdict ────────────────────────────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <AlertTriangle size={18} style={{ color: '#F59E0B' }} /> Verdict
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label style={labelStyle}>Mechanical Condition</label>
            <input value={verdictMechanical} onChange={e => setVerdictMechanical(e.target.value)} placeholder="e.g. Mechanically Good" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Issues Requiring Attention</label>
            <input value={verdictIssues} onChange={e => setVerdictIssues(e.target.value)} placeholder="e.g. AC, drive shaft, turbo needs attention" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Purchase Recommendation</label>
            <input value={verdictRecommendation} onChange={e => setVerdictRecommendation(e.target.value)} placeholder="e.g. Recommended for purchase after negotiations" style={inputStyle} />
          </div>
        </div>
      </section>

      {/* ── 11. Precautions / Recommendations ──────────────────────────────── */}
      <section style={sectionStyle}>
        <h3 style={sectionHeaderStyle}>
          <ShieldAlert size={18} style={{ color: '#EF4444' }} /> Precautions / Recommendations
        </h3>
        <div>
          <label style={labelStyle}>Vehicle Age / Condition Notes & Recommendations</label>
          <textarea
            value={precautions}
            onChange={e => setPrecautions(e.target.value)}
            placeholder={"Vehicle is aged with over 80k km driven\nCar needs TLC\nEarly service recommended\nRecommended throttle body cleaning\nInlet valve cleaning\nTurbo cleaning\nRadiator/intercooler cleaning\nSpark plugs check and replacement"}
            style={{ ...textareaStyle, minHeight: '160px' }}
          />
        </div>
      </section>

      {/* ── Submit Bar ─────────────────────────────────────────────────────── */}
      <div className="sticky bottom-0 py-4 sm:py-6 border-t border-gray-200 bg-white flex flex-wrap sm:flex-nowrap items-center justify-start gap-3 sm:gap-4 z-10 -mx-4 sm:mx-0 px-4 sm:px-0">
        <button
          onClick={onBack}
          style={{ padding: '12px 24px', backgroundColor: '#f3f4f6', color: '#374151', borderRadius: '12px', fontWeight: 700, border: '1px solid #d1d5db', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSaving}
          style={{
            padding: '12px 32px', backgroundColor: '#0059A3', color: '#ffffff',
            borderRadius: '12px', fontWeight: 700, border: 'none',
            cursor: isSaving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px',
            boxShadow: '0 4px 14px rgba(0, 89, 163, 0.3)',
            opacity: isSaving ? 0.7 : 1
          }}
        >
          <Save size={18} /> {isSaving ? 'Saving...' : (editReport ? 'Update Report' : 'Save Report')}
        </button>
      </div>
    </div>
  );
}
