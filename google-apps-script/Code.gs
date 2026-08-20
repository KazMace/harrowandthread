// Harrow & Thread — enquiry intake.
//
// Replaces Supabase + Web3Forms (2026-08-20). Paste this whole file into
// script.google.com (a new project), fill in the three constants below, then
// Deploy → New deployment → Web app, "Execute as: Me", "Who has access: Anyone".
// Copy the resulting /exec URL into PUBLIC_GAS_URL in the site's .env — that's
// the only wiring the site side needs (src/pages/enquire.astro).
//
// The static site POSTs here as text/plain JSON, not application/json — that's
// deliberate, see the comment in enquire.astro. This file must accept that.

// ---- Fill these in after creating the Sheet and the Drive folder ----------
const SHEET_ID = 'PASTE_GOOGLE_SHEET_ID_HERE';
const DRIVE_FOLDER_ID = 'PASTE_DRIVE_FOLDER_ID_HERE';
// Where the notification lands. Leave blank to send to whichever Google
// account this script is deployed under (Session.getEffectiveUser()).
const NOTIFY_EMAIL = '';
// -----------------------------------------------------------------------

// Keep in sync with src/lib/constants.ts FORM_FIELDS — this is the Sheet's
// column order, not a validation list; unknown keys are simply ignored.
const FIELD_ORDER = [
  'name', 'email', 'phone', 'iam', 'commission_type', 'location',
  'size_w', 'size_h', 'size_unsure', 'design_tier', 'timeline',
  'design_source', 'notes', 'marketing_consent',
];

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);

    // Honeypot, matched to the client (enquire.astro never sends this filled —
    // this is defence in depth, not the primary guard).
    if (body.website) return respond({ ok: true });

    if (!body.name || !body.email) {
      return respond({ ok: false, error: 'missing required fields' });
    }

    const { links, inlineImages } = saveImages(body.images || [], body.name);
    appendRow(body, links);
    sendNotification(body, links, inlineImages);

    return respond({ ok: true });
  } catch (err) {
    return respond({ ok: false, error: String(err) });
  }
}

// Apps Script Web Apps can't answer a CORS preflight (see enquire.astro's
// comment on this) — the client avoids triggering one at all. This exists
// only so a stray OPTIONS doesn't 404 loudly.
function doOptions() {
  return ContentService.createTextOutput('');
}

function respond(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Up to 3 images, already downscaled to JPEG client-side. Each becomes a
// Drive file, shared "anyone with the link" so the emailed link opens with no
// Google login — the whole point of this rebuild. The link is a long random
// Drive ID: not guessable, not browsable, but not access-controlled either.
function saveImages(images, enquiryName) {
  const links = [];
  const inlineImages = {};
  if (!images.length) return { links, inlineImages };

  const parent = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const folder = parent.createFolder(`${new Date().toISOString()} — ${enquiryName || 'unnamed'}`);

  images.slice(0, 3).forEach((img, i) => {
    const bytes = Utilities.base64Decode(img.dataB64);
    const blob = Utilities.newBlob(bytes, img.mimeType || 'image/jpeg', img.name || `photo-${i}.jpg`);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    links.push(file.getUrl());
    inlineImages['photo' + i] = file.getBlob();
  });

  return { links, inlineImages };
}

function appendRow(body, links) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  if (sheet.getLastRow() === 0) sheet.appendRow(['timestamp', ...FIELD_ORDER, 'photos']);
  sheet.appendRow([
    new Date(),
    ...FIELD_ORDER.map((k) => body[k] || ''),
    links.join(' | '),
  ]);
}

function sendNotification(body, links, inlineImages) {
  const rows = FIELD_ORDER
    .filter((k) => body[k])
    .map((k) => `<tr><td style="padding:4px 14px 4px 0;color:#666">${escapeHtml(k)}</td><td>${escapeHtml(String(body[k]))}</td></tr>`)
    .join('');

  const photos = links.length
    ? links.map((url, i) => `<p><a href="${url}">Photo ${i + 1} — open full size</a></p>`).join('')
    : '<p>No photos attached.</p>';

  const thumbs = Object.keys(inlineImages)
    .map((key) => `<img src="cid:${key}" style="max-width:220px;margin:4px 8px 4px 0;border-radius:4px" />`)
    .join('');

  const html = `
    <h2 style="font-family:sans-serif">New commission enquiry — ${escapeHtml(body.name || 'unnamed')}</h2>
    <table style="font-family:sans-serif;font-size:14px">${rows}</table>
    <h3 style="font-family:sans-serif">Photos</h3>
    ${photos}
    <div>${thumbs}</div>
  `;

  const to = NOTIFY_EMAIL || Session.getEffectiveUser().getEmail();
  GmailApp.sendEmail(to, `New commission enquiry — ${body.name || 'unnamed'}`, '', {
    htmlBody: html,
    inlineImages: inlineImages,
    name: 'Harrow & Thread website',
  });
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
