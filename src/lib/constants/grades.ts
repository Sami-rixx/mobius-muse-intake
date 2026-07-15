import { Grade } from '@/types';

// All grade bands
export const ALL_GRADES: Grade[] = ['G4', 'G5', 'G6', 'G7', 'G8', 'G9'];

// Grade band groups
export const GRADE_BANDS = {
  upperPrimary: ['G4', 'G5', 'G6'] as const,
  juniorSchool: ['G7', 'G8', 'G9'] as const,
} as const;

// Grade band labels
export const GRADE_BAND_LABELS = {
  upperPrimary: 'Upper Primary (G4-G6)',
  juniorSchool: 'Junior School (G7-G9)',
} as const;

// Priority labels and colors
export const PRIORITY_CONFIG = {
  1: { label: 'Preferred', color: 'bg-accentTeal', textColor: 'text-white' },
  2: { label: 'Normal', color: 'bg-headerBlue/50', textColor: 'text-textPrimary' },
  3: { label: 'Last Resort', color: 'bg-brushedBrass', textColor: 'text-deepMuseBlue' },
} as const;

// Type for grade band keys
export type GradeBand = keyof typeof GRADE_BANDS;
