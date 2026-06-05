// ─────────────────────────────────────────────────────────────────────────────
// InspectionStorage.ts — Client-side fetch wrapper for inspection reports
// ─────────────────────────────────────────────────────────────────────────────

export interface InspectionReportData {
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
  serviceRecommendations?: string;
  sellerDetails?: {
    name: string;
    contactNumber: string;
  };
  inspectorName: string;
  inspectionImages: string[];
  uploadedFile: string;
  uploadedFileName: string;
  createdAt: string;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

/** Get all inspection reports, optionally filtered by carId */
export async function getAllInspectionReports(carId?: string): Promise<InspectionReportData[]> {
  const url = carId
    ? `${getBaseUrl()}/api/inspection-reports?carId=${carId}`
    : `${getBaseUrl()}/api/inspection-reports`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.reports || []) as InspectionReportData[];
}

/** Get a single inspection report by ID */
export async function getInspectionReport(id: string): Promise<InspectionReportData | null> {
  const res = await fetch(`${getBaseUrl()}/api/inspection-reports/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.report as InspectionReportData;
}

/** Save a new inspection report */
export async function saveInspectionReport(
  report: Omit<InspectionReportData, "id" | "createdAt">
): Promise<InspectionReportData> {
  const res = await fetch(`${getBaseUrl()}/api/inspection-reports`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(report),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to save inspection report");
  }

  const data = await res.json();
  const savedReport = data.report as InspectionReportData;

  // Trigger Admin Notification
  if (typeof window !== "undefined") {
    import("@/Details/Notification/AdminNotify").then(async ({ addAdminNotification }) => {
      await addAdminNotification({
        title: "Report Generated 📄",
        message: `Inspection report for ${savedReport.carName} created successfully.`,
        type: "report",
        cta: { label: "View Reports", href: "/admin/inspection-reports" }
      });
    });
  }

  return savedReport;
}

/** Update an existing inspection report */
export async function updateInspectionReport(
  id: string,
  updates: Partial<InspectionReportData>
): Promise<InspectionReportData | null> {
  const res = await fetch(`${getBaseUrl()}/api/inspection-reports/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to update inspection report");
  }

  const data = await res.json();
  return data.report as InspectionReportData;
}

/** Delete an inspection report */
export async function deleteInspectionReport(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/inspection-reports/${id}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to delete inspection report");
  }
}
