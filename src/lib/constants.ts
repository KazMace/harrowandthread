export const SITE_NAME = 'Harrow & Thread';
export const SITE_URL = 'https://harrowandthread.com';
export const RESPONSE_PROMISE = 'We respond within one working day.';

// No rates or fee amounts live in code: prices left the site 2026-09-13.
// See the _note in src/data/pricing.json.

export const SIZE_LIMITS = {
  rug: { min: null, maxW: 15, maxH: 10 },
  wallHanging: { minArea: 1.5, minSide: 1, maxW: 6, maxH: 3 },
  carpet: { maxW: 15, maxH: 10 },
} as const;

export const PILE_HEIGHTS = [
  { value: 6, label: 'Low pile (6mm)', chooseIf: 'Sleek, easy to clean. Good for high-traffic areas.' },
  { value: 12, label: 'Medium pile (12mm)', chooseIf: 'A balance of comfort and practicality.' },
  { value: 20, label: 'High pile (20mm)', chooseIf: 'Soft and deep. The most luxurious option. Needs more care.' },
] as const;

export const MATERIALS = [
  { value: 'wool', label: 'Wool', description: 'Durable, soft, naturally stain resistant. The standard.' },
  { value: 'pure-silk', label: 'Pure silk', description: 'Adds lustre and depth. Finer, best for quieter areas.' },
  { value: 'bamboo-silk', label: 'Bamboo silk', description: 'A plant-based fibre with a silk-like sheen and soft hand.' },
  { value: 'flatweave', label: 'Flatweave', description: 'Flat, no pile. Lightweight, reversible, good under furniture.' },
] as const;

export const FORM_FIELDS = {
  enquiryType: [
    { value: '', label: 'Select...' },
    { value: 'private-client', label: 'Private client' },
    { value: 'interior-designer', label: 'Interior designer or architect' },
    { value: 'developer', label: 'Developer or hospitality' },
    { value: 'other', label: 'Other' },
  ],
  commissionType: [
    { value: '', label: 'Select...' },
    { value: 'rug', label: 'Rug' },
    { value: 'wall-hanging', label: 'Wall hanging' },
    { value: 'carpet', label: 'Wall-to-wall carpet' },
    { value: 'not-sure', label: 'Not sure' },
  ],
  designTier: [
    { value: '', label: 'Select...' },
    { value: 'plain', label: 'Plain' },
    { value: 'geometric', label: 'Geometric' },
    { value: 'pictorial', label: 'Pictorial' },
    { value: 'not-sure', label: 'Not sure' },
  ],
  timeline: [
    { value: '', label: 'Select...' },
    { value: 'right-away', label: 'Right away' },
    { value: 'within-3-months', label: 'Within 3 months' },
    { value: '3-6-months', label: '3–6 months' },
    { value: 'exploring', label: 'Exploring' },
  ],
  designSource: [
    { value: '', label: 'Select...' },
    { value: 'own-artwork', label: 'My own artwork or sketch' },
    { value: 'reference-image', label: 'A reference image' },
    { value: 'designer', label: "I'd like your designer" },
    { value: 'not-sure', label: 'Not sure' },
  ],
} as const;