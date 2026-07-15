// Predefined subjects with codes and N/A exclusions
// Based on the blueprint: SCI, INTSCI, PRETECH have N/A for certain grade bands

export interface SubjectConfig {
  code: string;
  name: string;
  // Grade bands where this subject is NOT available (N/A)
  naGradeBands: ('upperPrimary' | 'juniorSchool')[];
}

export const PREDEFINED_SUBJECTS: SubjectConfig[] = [
  {
    code: 'ENG',
    name: 'English',
    naGradeBands: [],
  },
  {
    code: 'MATH',
    name: 'Mathematics',
    naGradeBands: [],
  },
  {
    code: 'AGRIC',
    name: 'Agriculture & Nutrition',
    naGradeBands: [],
  },
  {
    code: 'SCI',
    name: 'Science & Technology',
    naGradeBands: ['juniorSchool'], // N/A for Junior School
  },
  {
    code: 'INTSCI',
    name: 'Integrated Science',
    naGradeBands: ['upperPrimary'], // N/A for Upper Primary
  },
  {
    code: 'PRETECH',
    name: 'Pre-Technical',
    naGradeBands: ['upperPrimary'], // N/A for Upper Primary
  },
];

// Get all subject codes
export const SUBJECT_CODES = PREDEFINED_SUBJECTS.map(s => s.code);

// Check if a subject is N/A for a grade band
export function isSubjectNA(subjectCode: string, gradeBand: 'upperPrimary' | 'juniorSchool'): boolean {
  const subject = PREDEFINED_SUBJECTS.find(s => s.code === subjectCode);
  return subject ? subject.naGradeBands.includes(gradeBand) : false;
}

// Get subject by code
export function getSubjectByCode(code: string): SubjectConfig | undefined {
  return PREDEFINED_SUBJECTS.find(s => s.code === code);
}
