"use client";

import { useEffect } from "react";
import { captureLeadAttribution } from "../lib/leadAttribution";

export function AttributionCapture() {
  useEffect(() => {
    captureLeadAttribution();
  }, []);

  return null;
}
