"use client";

import { useEffect } from "react";
import { incrementVisitorCount } from "@/Admin/DataSaver/AnalyticsStore";

export default function VisitorTracker() {
  useEffect(() => {
    // Increment visitor count when the component mounts
    incrementVisitorCount();
  }, []);

  return null;
}
