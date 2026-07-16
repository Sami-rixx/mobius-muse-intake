import { z } from 'zod';
import { ALL_GRADES } from '@/lib/constants';

// ============================================================================
// SCHEMAS FOR FORM VALIDATION
// ============================================================================

// Grade schema - must be one of the valid grades
export const GradeSchema = z.enum(ALL_GRADES as [string, ...string[]]);

// Priority schema - 1, 2, or 3
export const PrioritySchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

// ============================================================================
// STEP 1: SCHOOL INFORMATION SCHEMA
// ============================================================================

export const SchoolInfoSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  filledBy: z.string().min(1, 'Filled by is required'),
  filledAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
});

// ============================================================================
// STEP 1: POLICY CONFIGURATION SCHEMA
// ============================================================================

export const PolicyConfigSchema = z.object({
  generalistsGradeScope: z.enum(['no', 'yes']),
  insufficientHours: z.enum(['stop', 'go']),
  unclearData: z.enum(['default', 'resolve']),
  specialistsExist: z.enum(['yes', 'no']),
});

// ============================================================================
// STEP 2: SUBJECT SCHEMA
// ============================================================================

export const SubjectSchema = z.object({
  id: z.string(),
  code: z.string().min(1, 'Subject code is required').max(10, 'Subject code too long'),
  name: z.string().min(1, 'Subject name is required').max(100, 'Subject name too long'),
  gradeLevels: z.object({
    upperPrimary: z.boolean(),
    juniorSchool: z.boolean(),
  }),
  doubleLessonsAllowed: z.boolean(),
});

// Array of subjects
export const SubjectsSchema = z.array(SubjectSchema).min(1, 'At least one subject is required');

// ============================================================================
// STEP 3: TEACHER SCHEMA
// ============================================================================

export const TeacherSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Teacher name is required').max(100, 'Teacher name too long'),
  role: z.enum(['generalist', 'specialist']),
  maxPeriodsWeek: z.number().int().positive('Max periods must be greater than 0'),
  notes: z.string().max(500, 'Notes too long').optional(),
});

// Array of teachers
export const TeachersSchema = z.array(TeacherSchema).min(1, 'At least one teacher is required');

// ============================================================================
// TEACHER CAPABILITY SCHEMA
// ============================================================================

export const TeacherCapabilitySchema = z.object({
  teacherId: z.string(),
  subjectCode: z.string(),
  grades: z.array(GradeSchema),
});

// ============================================================================
// TEACHER PREFERENCE SCHEMA
// ============================================================================

export const TeacherPreferenceSchema = z.object({
  teacherId: z.string(),
  subjectCode: z.string(),
  grade: GradeSchema,
  priority: PrioritySchema,
});

// ============================================================================
// COMPLETE INTAKE FORM SCHEMA
// ============================================================================

export const CompleteIntakeFormSchema = z.object({
  schoolInfo: SchoolInfoSchema,
  policyConfig: PolicyConfigSchema,
  subjects: SubjectsSchema,
  teachers: TeachersSchema,
  teacherCapabilities: z.array(TeacherCapabilitySchema).optional(),
  teacherPreferences: z.array(TeacherPreferenceSchema).optional(),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type SchoolInfo = z.infer<typeof SchoolInfoSchema>;
export type PolicyConfig = z.infer<typeof PolicyConfigSchema>;
export type Subject = z.infer<typeof SubjectSchema>;
export type Teacher = z.infer<typeof TeacherSchema>;
export type TeacherCapability = z.infer<typeof TeacherCapabilitySchema>;
export type TeacherPreference = z.infer<typeof TeacherPreferenceSchema>;
export type CompleteIntakeForm = z.infer<typeof CompleteIntakeFormSchema>;
