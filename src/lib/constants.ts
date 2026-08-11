export const SITE_NAME = 'Harrow & Thread';
export const SITE_URL = 'https://harrowandthread.com';
export const RESPONSE_PROMISE = 'We respond within one working day.';

// STARTING rates, not fixed prices. Always rendered with "from" in front —
// the final rate is set at quote once the design is known. Never present these
// as the price. See the _note in src/data/pricing.json.
export const RATES = {
  plain: 600,
  geometric: 900,
  pictorial: 1200,
} as const;

export const DESIGN_FEE = 200;

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
  { value: 'silk-blend', label: 'Silk blend', description: 'Adds lustre and depth. Finer, best for quieter areas.' },
  { value: 'bamboo-silk', label: 'Bamboo silk', description: 'A vegan option with a silk-like sheen and soft hand.' },
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
  budget: [
    { value: '', label: 'Select...' },
    { value: 'under-5k', label: 'Under £5k' },
    { value: '5k-10k', label: '£5k–10k' },
    { value: '10k-25k', label: '£10k–25k' },
    { value: '25k-50k', label: '£25k–50k' },
    { value: '50k-plus', label: '£50k+' },
    { value: 'not-sure', label: 'Not sure' },
  ],
  timeline: [
    { value: '', label: 'Select...' },
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