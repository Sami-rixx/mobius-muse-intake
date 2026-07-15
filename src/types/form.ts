import { Grade, Priority } from './intake';

export type FormStep = 1 | 2 | 3;

export interface SchoolPolicyFormData {
  schoolName: string;
  filledBy: string;
  filledAt: string;
  generalistsGradeScope: 'no' | 'yes';
  insufficientHours: 'stop' | 'go';
  unclearData: 'default' | 'resolve';
  specialistsExist: 'yes' | 'no';
}

export interface SubjectFormData {
  subjectCode: string;
  subjectName: string;
  gradeLevels: {
    upperPrimary: boolean;
    juniorSchool: boolean;
  };
  periodsPerWeek: {
    upperPrimary: number;
    juniorSchool: number;
  };
  doubleLessonsAllowed: boolean;
}

export interface TeacherFormData {
  teacherName: string;
  role: 'generalist' | 'specialist';
  maxPeriodsWeek: number;
  notes: string;
}

export interface SubjectGradeCell {
  selected: boolean;
  priority: Priority | null;
}

export interface TeacherFormWithGrid extends TeacherFormData {
  capabilities: Record<string, Grade[]>;
  preferences: Record<string, Record<Grade, Priority>>;
}

export interface IntakeFormState {
  step1: SchoolPolicyFormData;
  step2: SubjectFormData[];
  step3: TeacherFormWithGrid[];
  currentStep: FormStep;
}

export type NavigationDirection = 'next' | 'prev' | 'submit';
