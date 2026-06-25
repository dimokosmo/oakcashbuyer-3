export type LeadAttribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  landing_page: string;
  referrer: string;
};

const STORAGE_KEY = "proper_home_options_lead_attribution";
const UTM_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

const emptyAttribution = (): LeadAttribution => ({
  utm_source: "",
  utm_medium: "",
  utm_campaign: "",
  utm_content: "",
  utm_term: "",
  landing_page: "",
  referrer: "",
});

export function captureLeadAttribution() {
  if (typeof window === "undefined") return;

  try {
    const stored = getLeadAttribution();
    const params = new URLSearchParams(window.location.search);
    const next: LeadAttribution = {
      ...stored,
      landing_page:
        stored.landing_page ||
        `${window.location.pathname}${window.location.search}`,
      referrer: stored.referrer || document.referrer,
    };

    UTM_FIELDS.forEach((field) => {
      const currentValue = params.get(field)?.trim();
      if (currentValue) next[field] = currentValue;
    });

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Attribution must never interfere with navigation or lead submission.
  }
}

export function getLeadAttribution(): LeadAttribution {
  if (typeof window === "undefined") return emptyAttribution();

  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return emptyAttribution();

    const parsed = JSON.parse(stored) as Partial<LeadAttribution>;
    return {
      ...emptyAttribution(),
      ...Object.fromEntries(
        Object.entries(parsed).filter(([, value]) => typeof value === "string")
      ),
    };
  } catch {
    return emptyAttribution();
  }
}
