import {
  SchoolInfoSchema,
  PolicyConfigSchema,
  SubjectSchema,
  TeacherSchema,
  CompleteIntakeFormSchema,
  type SchoolInfo,
  type PolicyConfig,
  type Subject,
  type Teacher,
} from './schemas';
import { z } from 'zod';

// ============================================================================
// VALIDATION FUNCTIONS
// ============================================================================

/**
 * Validate school information
 */
export function validateSchoolInfo(data: Partial<SchoolInfo>): {
  valid: boolean;
  errors: Record<string, string>;
  data: SchoolInfo | null;
} {
  const result = SchoolInfoSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {}, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return { valid: false, errors, data: null };
}

/**
 * Validate policy configuration
 */
export function validatePolicyConfig(data: Partial<PolicyConfig>): {
  valid: boolean;
  errors: Record<string, string>;
  data: PolicyConfig | null;
} {
  const result = PolicyConfigSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {}, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return { valid: false, errors, data: null };
}

/**
 * Validate a single subject
 */
export function validateSubject(data: Partial<Subject> & { id?: string }): {
  valid: boolean;
  errors: Record<string, string>;
  data: Subject | null;
} {
  // Create a schema without the id requirement for partial updates
  const PartialSubjectSchema = SubjectSchema.partial().extend({
    id: z.string().optional(),
  });

  const result = PartialSubjectSchema.safeParse(data);

  if (result.success) {
    // If we have all required fields, validate as full subject
    if (data.code && data.name) {
      const fullResult = SubjectSchema.safeParse({
        ...data,
        id: data.id || 'temp',
        gradeLevels: data.gradeLevels || { upperPrimary: false, juniorSchool: false },
        doubleLessonsAllowed: data.doubleLessonsAllowed ?? false,
      });

      if (fullResult.success) {
        return { valid: true, errors: {}, data: fullResult.data };
      }
    }
    return { valid: true, errors: {}, data: null };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return { valid: false, errors, data: null };
}

/**
 * Validate all subjects
 */
export function validateSubjects(subjects: Partial<Subject>[]): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (subjects.length === 0) {
    errors.subjects = 'At least one subject is required';
    return { valid: false, errors };
  }

  subjects.forEach((subject, index) => {
    const result = validateSubject(subject);
    if (!result.valid) {
      Object.entries(result.errors).forEach(([field, message]) => {
        errors[`subject-${index}-${field}`] = message;
      });
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate a single teacher
 */
export function validateTeacher(data: Partial<Teacher> & { id?: string }): {
  valid: boolean;
  errors: Record<string, string>;
  data: Teacher | null;
} {
  // Create a schema without the id requirement for partial updates
  const PartialTeacherSchema = TeacherSchema.partial().extend({
    id: z.string().optional(),
    notes: z.string().optional(),
  });

  const result = PartialTeacherSchema.safeParse(data);

  if (result.success) {
    // If we have all required fields, validate as full teacher
    if (data.name && data.role !== undefined && data.maxPeriodsWeek !== undefined) {
      const fullResult = TeacherSchema.safeParse({
        ...data,
        id: data.id || 'temp',
        notes: data.notes || '',
      });

      if (fullResult.success) {
        return { valid: true, errors: {}, data: fullResult.data };
      }
    }
    return { valid: true, errors: {}, data: null };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return { valid: false, errors, data: null };
}

/**
 * Validate all teachers
 */
export function validateTeachers(teachers: Partial<Teacher>[]): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (teachers.length === 0) {
    errors.teachers = 'At least one teacher is required';
    return { valid: false, errors };
  }

  teachers.forEach((teacher, index) => {
    const result = validateTeacher(teacher);
    if (!result.valid) {
      Object.entries(result.errors).forEach(([field, message]) => {
        errors[`teacher-${index}-${field}`] = message;
      });
    }
  });

  return { valid: Object.keys(errors).length === 0, errors };
}

/**
 * Validate complete intake form
 */
export function validateCompleteForm(data: unknown): {
  valid: boolean;
  errors: Record<string, string>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any | null;
} {
  const result = CompleteIntakeFormSchema.safeParse(data);

  if (result.success) {
    return { valid: true, errors: {}, data: result.data };
  }

  const errors: Record<string, string> = {};
  result.error.errors.forEach((error) => {
    const path = error.path.join('.');
    errors[path] = error.message;
  });

  return { valid: false, errors, data: null };
}

/**
 * Get error message for a specific field
 */
export function getFieldError(errors: Record<string, string>, field: string): string | null {
  return errors[field] || null;
}

/**
 * Check if there are any errors
 */
export function hasErrors(errors: Record<string, string>): boolean {
  return Object.keys(errors).length > 0;
}
