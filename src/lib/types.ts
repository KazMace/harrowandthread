export interface ImageAsset {
  id: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  sizes?: string;
}

export interface PricingTier {
  id: 'plain' | 'geometric' | 'pictorial';
  name: string;
  rate: number;
  description: string;
  chooseIf: string;
  caveat?: string;
}

export interface WorkedExample {
  label: string;
  area: number;
  plain: number;
  geometric: number;
  pictorial: number;
}

export interface FormField {
  value: string;
  label: string;
}

export interface ColourSwatch {
  hex: string;
  name: string;
}