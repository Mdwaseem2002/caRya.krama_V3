export interface ReportSection {
  label: string;
  score: number;
}

export interface DetailedItem {
  label: string;
  value: string;
  status: 'ok' | 'issue';
}

export interface DetailedSection {
  icon: string;
  title: string;
  items: DetailedItem[];
}

export interface CarReportData {
  carId: string;
  overallScore: number;
  sections: ReportSection[];
  detailed: DetailedSection[];
  remarks: { type: string; text: string }[];
  isApproved: boolean;
  price: number;
}

const STORAGE_KEY = 'car_reports_db';

export const getReports = (): CarReportData[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveReport = (report: CarReportData) => {
  const reports = getReports();
  const index = reports.findIndex(r => r.carId === report.carId);
  if (index > -1) {
    reports[index] = report;
  } else {
    reports.push(report);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
};

export const getReportByCarId = (carId: string): CarReportData | undefined => {
  return getReports().find(r => r.carId === carId);
};
