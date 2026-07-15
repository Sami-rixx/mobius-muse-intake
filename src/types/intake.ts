// Grade bands (G4-G9)
export type Grade = 'G4' | 'G5' | 'G6' | 'G7' | 'G8' | 'G9';

// Priority levels (1=Preferred, 2=Normal, 3=Last Resort)
export type Priority = 1 | 2 | 3;

// Granularity for preferences (we chose per-grade override)
export type Granularity = 'grade_level';

// Subject data structure
export interface Subject {
  subject_code: string;
  subject_name: string;
  grade_levels: Grade[];
  periods_per_week: number[];
  double_lessons_allowed: boolean;
}

// Policy data structure
export type GeneralistsGradeScope = 'explicit_only' | 'unrestricted';
export type OverloadPolicy = 'block' | 'allow-overload';
export type AmbiguousDataPolicy = 'use_default_and_warn' | 'block_until_resolved';

export interface Policy {
  generalists_grade_scope: GeneralistsGradeScope;
  overload_policy: OverloadPolicy;
  ambiguous_data_policy: AmbiguousDataPolicy;
  specialist_scope_lock: boolean;
}

// Teacher data structure
export interface Teacher {
  teacher_id: string; // T1, T2, T3...
  teacher_name: string; // NOT "name" - critical!
  max_periods_week: number;
  specialist: boolean;
  confidence: number; // Default: 1.0
  flag_note: string | null;
}

// Capability data structure (teacher can teach subject at grades)
export interface Capability {
  teacher_id: string;
  subject_code: string;
  grades_can_teach: Grade[];
}

// Preference data structure (with per-grade granularity)
export interface Preference {
  teacher_id: string;
  subject_code: string;
  grades: Grade[]; // Grades for which this priority applies
  priority: Priority;
  granularity: Granularity;
}

// School data structure
export interface School {
  name: string;
  filled_by: string;
  filled_at: string; // Format: DD/MM/YYYY
}

// Complete intake payload (matches Gatechecker contract)
export interface IntakePayload {
  schema_version: string;
  school: School;
  policy: Policy;
  subjects: Subject[];
  teachers: Teacher[];
  capabilities: Capability[];
  preferences: Preference[];
}
