/**
 * Transform form data to Gatechecker-compatible format
 * This maps our UI state to the exact structure expected by the Gatechecker API
 */

import {
  School,
  Policy,
  Subject,
  Teacher,
  Capability,
  Preference,
  IntakePayload,
  GeneralistsGradeScope,
  OverloadPolicy,
  AmbiguousDataPolicy,
} from '@/types/intake';
import { GRADE_BANDS } from '@/lib/constants';
import { useIntakeStore } from '@/store/useIntakeStore';

// ============================================================================
// MAPPING FUNCTIONS
// ============================================================================

/**
 * Map policy UI values to Gatechecker enum values
 */
function mapGeneralistsGradeScope(value: 'no' | 'yes'): GeneralistsGradeScope {
  return value === 'yes' ? 'unrestricted' : 'explicit_only';
}

function mapInsufficientHours(value: 'stop' | 'go'): OverloadPolicy {
  return value === 'go' ? 'allow-overload' : 'block';
}

function mapUnclearData(value: 'default' | 'resolve'): AmbiguousDataPolicy {
  return value === 'resolve' ? 'block_until_resolved' : 'use_default_and_warn';
}

/**
 * Map specialist existence to boolean
 */
function mapSpecialistsExist(value: 'yes' | 'no'): boolean {
  return value === 'yes';
}

/**
 * Convert grade band to array of grades
 * upperPrimary = G4, G5, G6
 * juniorSchool = G7, G8, G9
 */
function gradeBandToGrades(gradeBand: 'upperPrimary' | 'juniorSchool'): string[] {
  return [...GRADE_BANDS[gradeBand]];
}

/**
 * Get all grades for a subject based on its gradeLevels
 */
function getSubjectGrades(subjectGradeLevels: {
  upperPrimary: boolean;
  juniorSchool: boolean;
}): string[] {
  const grades: string[] = [];

  if (subjectGradeLevels.upperPrimary) {
    grades.push(...gradeBandToGrades('upperPrimary'));
  }
  if (subjectGradeLevels.juniorSchool) {
    grades.push(...gradeBandToGrades('juniorSchool'));
  }

  return grades;
}

// ============================================================================
// TRANSFORM FUNCTIONS
// ============================================================================

/**
 * Transform school info to Gatechecker School format
 */
export function transformSchool(schoolName: string, filledBy: string, filledAt: string): School {
  // Format date as DD/MM/YYYY
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return {
    name: schoolName,
    filled_by: filledBy,
    filled_at: formatDate(filledAt),
  };
}

/**
 * Transform policy config to Gatechecker Policy format
 */
export function transformPolicy(
  generalistsGradeScope: 'no' | 'yes',
  insufficientHours: 'stop' | 'go',
  unclearData: 'default' | 'resolve',
  specialistsExist: 'yes' | 'no'
): Policy {
  return {
    generalists_grade_scope: mapGeneralistsGradeScope(generalistsGradeScope),
    overload_policy: mapInsufficientHours(insufficientHours),
    ambiguous_data_policy: mapUnclearData(unclearData),
    specialist_scope_lock: mapSpecialistsExist(specialistsExist),
  };
}

/**
 * Transform a single subject to Gatechecker Subject format
 */
export function transformSubject(
  code: string,
  name: string,
  gradeLevels: { upperPrimary: boolean; juniorSchool: boolean },
  doubleLessonsAllowed: boolean
): Subject {
  const grades = getSubjectGrades(gradeLevels);

  return {
    subject_code: code,
    subject_name: name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grade_levels: grades as any,
    periods_per_week: grades.map(() => 0), // Default to 0, can be updated
    double_lessons_allowed: doubleLessonsAllowed,
  };
}

/**
 * Transform a teacher to Gatechecker Teacher format
 */
export function transformTeacher(
  id: string,
  name: string,
  role: 'generalist' | 'specialist',
  maxPeriodsWeek: number,
  notes: string
): Teacher {
  return {
    teacher_id: id,
    teacher_name: name,
    max_periods_week: maxPeriodsWeek,
    specialist: role === 'specialist',
    confidence: 1.0, // Default confidence
    flag_note: notes || null,
  };
}

/**
 * Transform teacher capabilities to Gatechecker Capability format
 */
export function transformCapabilities(
  teacherId: string,
  subjectCode: string,
  grades: string[]
): Capability {
  return {
    teacher_id: teacherId,
    subject_code: subjectCode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grades_can_teach: grades as any,
  };
}

/**
 * Transform teacher preferences to Gatechecker Preference format
 */
export function transformPreference(
  teacherId: string,
  subjectCode: string,
  grades: string[],
  priority: 1 | 2 | 3
): Preference {
  return {
    teacher_id: teacherId,
    subject_code: subjectCode,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    grades: grades as any,
    priority,
    granularity: 'grade_level' as const,
  };
}

// ============================================================================
// MAIN TRANSFORMATION FUNCTION
// ============================================================================

/**
 * Transform the entire intake store state to Gatechecker IntakePayload format
 */
export function transformToGatecheckerPayload(store: ReturnType<typeof useIntakeStore.getState>) {
  const { schoolInfo, policyConfig, subjects, teachers, teacherCapabilities, teacherPreferences } =
    store;

  // Transform school
  const school = transformSchool(schoolInfo.schoolName, schoolInfo.filledBy, schoolInfo.filledAt);

  // Transform policy
  const policy = transformPolicy(
    policyConfig.generalistsGradeScope,
    policyConfig.insufficientHours,
    policyConfig.unclearData,
    policyConfig.specialistsExist
  );

  // Transform subjects
  const transformedSubjects = subjects.map((subject) =>
    transformSubject(subject.code, subject.name, subject.gradeLevels, subject.doubleLessonsAllowed)
  );

  // Transform teachers
  const transformedTeachers = teachers.map((teacher) =>
    transformTeacher(teacher.id, teacher.name, teacher.role, teacher.maxPeriodsWeek, teacher.notes)
  );

  // Transform capabilities
  const transformedCapabilities = teacherCapabilities.map((cap) =>
    transformCapabilities(cap.teacherId, cap.subjectCode, cap.grades)
  );

  // Transform preferences
  // Group preferences by teacher+subject to match Gatechecker format
  const preferenceMap = new Map<string, { grades: string[]; priority: 1 | 2 | 3 }>();

  teacherPreferences.forEach((pref) => {
    const key = `${pref.teacherId}-${pref.subjectCode}`;
    const existing = preferenceMap.get(key);

    if (existing && existing.priority === pref.priority) {
      // Same priority, add to grades
      existing.grades.push(pref.grade);
    } else if (existing) {
      // Different priority - this shouldn't happen in our UI, but handle it
      // For now, just add as separate preference
      preferenceMap.set(key, { grades: [pref.grade], priority: pref.priority });
    } else {
      // New entry
      preferenceMap.set(key, { grades: [pref.grade], priority: pref.priority });
    }
  });

  const transformedPreferences: Preference[] = [];
  preferenceMap.forEach((value, key) => {
    const [teacherId, subjectCode] = key.split('-');
    transformedPreferences.push(
      transformPreference(teacherId, subjectCode, value.grades, value.priority)
    );
  });

  // Build final payload
  const payload: IntakePayload = {
    schema_version: '1.0.0',
    school,
    policy,
    subjects: transformedSubjects,
    teachers: transformedTeachers,
    capabilities: transformedCapabilities,
    preferences: transformedPreferences,
  };

  return payload;
}

/**
 * Hook version for use in components
 */
export function useGatecheckerPayload() {
  const storeState = useIntakeStore();
  return transformToGatecheckerPayload(storeState);
}
