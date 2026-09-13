# Booking calendar plan — Harrow & Thread

Written 2026-08-23. Line numbers in the code pointers below are from before the
2026-08-26 homepage rebuild — re-find them before building.

## Why

The site has an enquiry form but no way to book a call or a home visit. The plan is
to add one, free, on top of the Google account already in use for the enquiry
pipeline (see `google-apps-script/README.md`).

## Tool: Cal.com free plan

Chosen over Google's own free booking page because a free Google account only gives
**one** appointment schedule — one job type, Google's look, no custom questions, no
deposits. Cal.com free gives unlimited booking types and your logo/colours in the
widget, and it syncs both ways into the Google Calendar you already have. It's open
source too, so if their pricing ever changes, self-hosting is a free fallback.

Rejected: building a calendar ourselves in Apps Script. Possible, but it means
owning double-booking bugs, timezones, daylight saving, and reminder emails
ourselves — weeks of upkeep for something free off the shelf.

## Hard constraint: link out, don't embed

`COMPLIANCE.md:65` — no non-essential cookie fires before consent, and this site has
a cookie banner (`src/components/global/CookieBanner.astro`). An **embedded**
Cal.com widget loads third-party JavaScript on page load, before any consent —
that breaks the rule. So the booking entry point on this site is a **button that
opens Cal.com in a new tab**, not an inline widget. Zero third-party script on this
domain, zero new cookie work, and the Cal.com page still shows the brand's logo and
colours.

## What to build

1. **New page** `src/pages/book.astro` — short page using `BaseLayout`, one
   heading, one paragraph, two buttons (one per booking type below), each
   `target="_blank" rel="noopener"` pointing at the Cal.com URL. Reuse the existing
   `btn btn-primary` classes — don't invent new button styles.
2. **`src/data/site.json`** — add `{"label": "Book", "href": "/book"}` to the `nav`
   array, and add the two Cal.com URLs under the existing `externalLinks` object
   (next to `arsColours`, line 47). Don't hardcode the URLs inside the page.
3. **`src/components/global/Header.astro:25`** — the "Enquire" button lives here.
   Recommend adding "Book" only via `site.nav`, not a second header button — two
   competing calls to action looks worse than one.

Booking types to create in Cal.com (see Kaz's checklist below):
- **Design consultation** — 30 min, phone/video
- **Home visit and measure** — 90 min, in person, ask for postcode

Keep the deep intake questions (size, material, budget) on `/enquire`. The booking
form should only ask what's needed to hold the slot — don't duplicate the enquiry
form inside Cal.com.

## Verification

- `npm run build` — clean build.
- Visit `/book`, click both buttons, confirm each opens the right Cal.com page.
- Book one real test slot on each type, confirm it lands in the H&T Google Calendar
  and a confirmation email arrives.
- Keyboard-only pass: Tab reaches both buttons, focus ring visible
  (`COMPLIANCE.md` accessibility floor — never `focus:outline-none`).

## Kaz's checklist (manual, in the browser — not code)

- [ ] Create `cal.com/harrowandthread` on the existing H&T Google account
- [ ] Connect Google Calendar (two-way sync), set working hours and minimum notice
- [ ] Upload logo, set brand colour
- [ ] Create the two booking types listed above
- [ ] Send the two resulting Cal.com URLs back so they can go into `site.json`

## Optional later step — bookings into the same Sheet

Skip unless you want one single list of all customer contact. Cal.com can fire a
webhook on `BOOKING_CREATED` at the same Apps Script `/exec` URL used for enquiries;
add a branch in `google-apps-script/Code.gs`'s `doPost` to write a booking row.
Only worth it if that Sheet actually gets read daily.

## Free-tier limits to watch

| Limit | Free ceiling |
|---|---|
| Drive storage | 15 GB, shared with Gmail — rug photos eat this |
| Apps Script email | 100/day on a consumer account |
| Cal.com bookings | Unlimited on free |

⚠️ Free-tier terms change — re-check Cal.com's and Google's pricing pages before
relying on them long-term. If volume grows, the upgrade path is Google Workspace on
the custom domain (raises the email cap to 1,500/day and adds account recovery),
not switching away from Google.
