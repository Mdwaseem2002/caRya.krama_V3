// ─────────────────────────────────────────────────────────────────────────────
// src/models/InspectionReport.ts
// Mongoose schema for Vehicle Inspection Reports.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript Interface ──────────────────────────────────────────────────────

export interface IInspectionReport extends Document {
  id: string;
  carId: string;
  carName: string;
  reportType: "created" | "uploaded";

  vehicleDetails: {
    carName: string;
    year: string;
    odometer: string;
  };

  bodyInspection: {
    panelsChecked: string;
    notes: string;
  };

  engineBay: string;

  fluids: {
    engineOil: string;
    coolant: string;
    brakeOil: string;
    serviceNotes: string;
  };

  battery: {
    ignitionVoltage: string;
    crankingVoltage: string;
    chargingVoltage: string;
    loadRange: string;
    systemWorking: boolean;
  };

  interiors: {
    condition: string;
    issues: string;
  };

  obdScan: {
    faultCodes: string;
    ecmStatus: string;
  };

  testDrive: {
    performance: string;
    braking: string;
    observations: string;
  };

  overallSummary: {
    mechanical: string;
    body: string;
  };

  verdict: {
    mechanicalCondition: string;
    issuesAttention: string;
    purchaseRecommendation: string;
  };

  precautions: string;

  sellerDetails?: {
    name: string;
    contactNumber: string;
  };

  // For uploaded reports
  uploadedFile: string;
  uploadedFileName: string;

  createdAt: Date;
  updatedAt: Date;
}

// ── Schema Definition ─────────────────────────────────────────────────────────

const InspectionReportSchema = new Schema<IInspectionReport>(
  {
    id: { type: String, required: true, unique: true, index: true },
    carId: { type: String, required: true, index: true },
    carName: { type: String, default: "" },
    reportType: {
      type: String,
      enum: ["created", "uploaded"],
      required: true,
    },

    vehicleDetails: {
      carName: { type: String, default: "" },
      year: { type: String, default: "" },
      odometer: { type: String, default: "" },
    },

    bodyInspection: {
      panelsChecked: { type: String, default: "" },
      notes: { type: String, default: "" },
    },

    engineBay: { type: String, default: "" },

    fluids: {
      engineOil: { type: String, default: "" },
      coolant: { type: String, default: "" },
      brakeOil: { type: String, default: "" },
      serviceNotes: { type: String, default: "" },
    },

    battery: {
      ignitionVoltage: { type: String, default: "" },
      crankingVoltage: { type: String, default: "" },
      chargingVoltage: { type: String, default: "" },
      loadRange: { type: String, default: "" },
      systemWorking: { type: Boolean, default: false },
    },

    interiors: {
      condition: { type: String, default: "" },
      issues: { type: String, default: "" },
    },

    obdScan: {
      faultCodes: { type: String, default: "" },
      ecmStatus: { type: String, default: "" },
    },

    testDrive: {
      performance: { type: String, default: "" },
      braking: { type: String, default: "" },
      observations: { type: String, default: "" },
    },

    overallSummary: {
      mechanical: { type: String, default: "" },
      body: { type: String, default: "" },
    },

    verdict: {
      mechanicalCondition: { type: String, default: "" },
      issuesAttention: { type: String, default: "" },
      purchaseRecommendation: { type: String, default: "" },
    },

    precautions: { type: String, default: "" },

    sellerDetails: {
      name: { type: String, default: "" },
      contactNumber: { type: String, default: "" },
    },

    uploadedFile: { type: String, default: "" },
    uploadedFileName: { type: String, default: "" },
  },
  {
    timestamps: true,
    collection: "inspection_reports",
    toJSON: {
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// ── Indexing for Performance ────────────────────────────────────────────────────
InspectionReportSchema.index({ carId: 1, createdAt: -1 });

// ── Model Export ──────────────────────────────────────────────────────────────

const InspectionReport: Model<IInspectionReport> =
  mongoose.models.InspectionReport ||
  mongoose.model<IInspectionReport>("InspectionReport", InspectionReportSchema);

export default InspectionReport;
