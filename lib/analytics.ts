type AnalyticsEventName =
  | "investor_form_started"
  | "investor_form_step_completed"
  | "investor_fit_calculated"
  | "investor_form_submitted"
  | "investor_lead_success"
  | "investor_lead_error"
  | "city_page_cta_clicked"
  | "homepage_cta_clicked";

type AnalyticsEventParams = {
  page_path?: string;
  form_step?: string | number;
  investor_fit?: string;
  investor_fit_score_range?: string;
  city_slug?: string;
  cta_label?: string;
  lead_type?: string;
  error_type?: string;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: AnalyticsEventName,
      params: AnalyticsEventParams
    ) => void;
  }
}

const allowedParams = new Set([
  "page_path",
  "form_step",
  "investor_fit",
  "investor_fit_score_range",
  "city_slug",
  "cta_label",
  "lead_type",
  "error_type",
]);

export function investorFitScoreRange(score: number) {
  if (score >= 7) return "7_plus";
  if (score >= 4) return "4_to_6";
  return "0_to_3";
}

export function trackEvent(
  eventName: AnalyticsEventName,
  params: AnalyticsEventParams = {}
) {
  if (
    typeof window === "undefined" ||
    !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    typeof window.gtag !== "function"
  ) {
    return;
  }

  try {
    const safeParams = Object.entries(params).reduce<AnalyticsEventParams>(
      (acc, [key, value]) => {
        if (allowedParams.has(key) && value !== undefined && value !== null) {
          acc[key as keyof AnalyticsEventParams] = value as never;
        }
        return acc;
      },
      {}
    );

    window.gtag("event", eventName, {
      page_path: window.location.pathname,
      ...safeParams,
    });
  } catch {
    // Analytics should never affect the user experience or lead submission.
  }
}

export {};
