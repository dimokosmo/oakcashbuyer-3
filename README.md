# OaklandCash Buyer

OaklandCash Buyer is a Next.js App Router site for local investor property review. It is built to collect homeowner submissions for properties that may fit rentals, flips, renovations, direct investor purchases, assignments, or off-market review.

The primary business goal is investor acquisition leads, not a traditional Realtor listing funnel. A listing conversation can be a secondary option when it genuinely fits better.

## Production Environment Variables

Set these in Vercel before launch.

### Required for Launch

- `NEXT_PUBLIC_SITE_URL`: Final production URL, used for sitemap and robots output.

### Recommended for Launch

- `ENABLE_CLICKUP_LEADS`: Set to `false` to intentionally disable ClickUp task creation. Set to `true` with both ClickUp credentials to enable it. If omitted, ClickUp retains its legacy behavior and runs only when both credentials are present.
- `CLICKUP_API_KEY`: ClickUp API key for task creation when ClickUp leads are enabled.
- `CLICKUP_LIST_ID`: ClickUp list ID where valid leads should become tasks when ClickUp leads are enabled.
- `RESEND_API_KEY`: Resend API key for lead notification emails.
- `LEAD_NOTIFICATION_EMAIL`: Recipient email for lead notifications.
- `TWILIO_ACCOUNT_SID`: Twilio account SID for SMS alerts.
- `TWILIO_AUTH_TOKEN`: Twilio auth token for SMS alerts.
- `TWILIO_FROM_NUMBER`: Twilio sender phone number.
- `LEAD_NOTIFICATION_PHONE`: Recipient phone number for SMS alerts.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID for privacy-safe funnel tracking.
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Google Search Console verification token.

Never commit real credentials or tokens to the repository.

## Run Locally

```bash
npm install
npm run dev
```

Open the local Next.js URL shown in the terminal.

## Build

```bash
npm run build
```

The build should include:

- `/`
- `/thank-you`
- `/api/leads`
- `/sitemap.xml`
- `/robots.txt`
- `/sell/[city]` static city pages

## Test a Lead

1. Start the app locally.
2. Open the homepage.
3. Complete the Investor Property Review form with test information.
4. Submit the form.
5. Confirm the browser redirects to `/thank-you`.

Use obvious test data and avoid real homeowner personal information during local testing.

## Confirm ClickUp Task Creation

1. Set `ENABLE_CLICKUP_LEADS=true`, `CLICKUP_API_KEY`, and `CLICKUP_LIST_ID` in the environment.
2. Submit a valid test lead.
3. Open the configured ClickUp list.
4. Confirm a task named like `Investor Property Review: [Address], [City]`.
5. Confirm the task description includes investor fit, property details, seller contact details, source, and timestamp.

Set `ENABLE_CLICKUP_LEADS=false` to disable ClickUp task creation while allowing email and SMS notifications to continue. To re-enable it later, set the value to `true` and provide both ClickUp credentials. If the toggle is omitted, the app attempts ClickUp only when both credentials exist. Missing credentials or ClickUp failures never block a valid lead.

## Confirm Email Notification

1. Set `RESEND_API_KEY` and `LEAD_NOTIFICATION_EMAIL`.
2. Submit a valid test lead.
3. Confirm the configured recipient receives a lead notification.
4. Confirm the email includes investor fit, property summary, contact method, and source.

Production should eventually use a verified sender domain instead of the Resend onboarding sender.

## Confirm SMS Notification

1. Set `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM_NUMBER`, and `LEAD_NOTIFICATION_PHONE`.
2. Submit a valid test lead.
3. Confirm the configured phone receives a short OaklandCash lead alert.

If SMS is not configured or Twilio fails, valid leads still return success to the homeowner.

## Confirm GA4 Events

1. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. Deploy or run the site in an environment where GA scripts can load.
3. Use GA4 DebugView or Realtime reporting.
4. Walk through the homepage form and city-page CTAs.
5. Confirm these events appear:

- `homepage_cta_clicked`
- `city_page_cta_clicked`
- `investor_form_started`
- `investor_form_step_completed`
- `investor_fit_calculated`
- `investor_form_submitted`
- `investor_lead_success`
- `investor_lead_error` when testing an intentional error

Analytics must not include names, email addresses, phone numbers, street addresses, ZIP codes, or full property details.

## Google Search Console

1. Set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to the Search Console verification token.
2. Deploy the site.
3. Verify the production homepage contains the `google-site-verification` meta tag.
4. In Google Search Console, submit:

```text
https://your-production-domain.com/sitemap.xml
```

The sitemap includes the homepage and real `/sell/[city]` SEO pages. It intentionally excludes `/thank-you` and `/api/leads`.

## Final Pre-Launch Checklist

- Confirm `NEXT_PUBLIC_SITE_URL` is the final production domain.
- Confirm `/sitemap.xml` loads and lists the homepage plus city pages.
- Confirm `/robots.txt` loads and disallows `/api/` and `/thank-you`.
- Confirm all 15 `/sell/[city]` pages build and load.
- Confirm the homepage form submits successfully.
- Confirm successful submissions redirect to `/thank-you`.
- Confirm ClickUp is intentionally disabled, or confirm task creation with a test lead.
- Confirm Resend email notification if enabled.
- Confirm Twilio SMS notification if enabled.
- Confirm GA4 events fire without personal information.
- Confirm Google Search Console verification succeeds.
- Confirm no secrets are committed to git.
- Run `npm run build` before deployment.
