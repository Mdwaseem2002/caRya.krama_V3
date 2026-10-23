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
  inspectionImages: any[]; // Array of strings or {url, description}
  uploadedInspectedFiles: { file: string; fileName: string }[];
  uploadedFile: string;
  uploadedFileName: string;
  createdAt: string;
}

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

interface CacheStore {
  data: InspectionReportData[] | null;
  time: number;
}
const cache: CacheStore = {
  data: null,
  time: 0,
};
const CACHE_TTL = 60 * 1000; // 60s
const STORAGE_KEY = "carya_cached_reports";

export function getCachedInspectionReports(): InspectionReportData[] {
  if (cache.data && cache.data.length > 0) return cache.data;
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cache.data = parsed;
          return parsed;
        }
      }
    } catch {}
  }
  return [];
}

export function clearReportsCache() {
  cache.data = null;
  cache.time = 0;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
  }
}

/** Get all inspection reports, optionally filtered by carId */
export async function getAllInspectionReports(
  carId?: string,
  forceRefresh = false
): Promise<InspectionReportData[]> {
  const now = Date.now();
  if (!carId && !forceRefresh && cache.data && now - cache.time < CACHE_TTL) {
    return cache.data;
  }

  const url = carId
    ? `${getBaseUrl()}/api/inspection-reports?carId=${carId}`
    : `${getBaseUrl()}/api/inspection-reports`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return cache.data || [];
  const data = await res.json();
  const reports = (data.reports || []) as InspectionReportData[];

  if (!carId) {
    cache.data = reports;
    cache.time = now;
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
      } catch {}
    }
  }

  return reports;
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

  clearReportsCache();

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

  clearReportsCache();

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

  clearReportsCache();
}
