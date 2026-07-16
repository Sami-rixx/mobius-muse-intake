import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { FormStep } from '@/types';

// ============================================================================
// TYPES
// ============================================================================

interface SchoolInfo {
  schoolName: string;
  filledBy: string;
  filledAt: string;
}

interface PolicyConfig {
  generalistsGradeScope: 'no' | 'yes';
  insufficientHours: 'stop' | 'go';
  unclearData: 'default' | 'resolve';
  specialistsExist: 'yes' | 'no';
}

interface Subject {
  id: string;
  code: string;
  name: string;
  gradeLevels: {
    upperPrimary: boolean;
    juniorSchool: boolean;
  };
  doubleLessonsAllowed: boolean;
}

interface Teacher {
  id: string;
  name: string;
  role: 'generalist' | 'specialist';
  maxPeriodsWeek: number;
  notes: string;
  // These will be populated from the store's teacherCapabilities and teacherPreferences
  capabilities?: TeacherCapability[];
  preferences?: TeacherPreference[];
}

// Teacher capability: which subjects they can teach at which grades
interface TeacherCapability {
  teacherId: string;
  subjectCode: string;
  grades: string[]; // Array of grade codes like ['G4', 'G5', ...]
}

// Teacher preference: priority for teaching specific subjects at specific grades
interface TeacherPreference {
  teacherId: string;
  subjectCode: string;
  grade: string;
  priority: 1 | 2 | 3; // 1=Preferred, 2=Normal, 3=Last Resort
}

interface IntakeState {
  // Step data
  schoolInfo: SchoolInfo;
  policyConfig: PolicyConfig;
  subjects: Subject[];
  teachers: Teacher[];
  teacherCapabilities: TeacherCapability[];
  teacherPreferences: TeacherPreference[];

  // Navigation
  currentStep: FormStep;

  // Validation state
  validationErrors: Record<string, string>;
}

interface IntakeActions {
  // School Info actions
  setSchoolInfo: (info: Partial<SchoolInfo>) => void;

  // Policy Config actions
  setPolicyConfig: (config: Partial<PolicyConfig>) => void;

  // Subject actions
  addSubject: (subject: Omit<Subject, 'id'>) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  removeSubject: (id: string) => void;

  // Teacher actions
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  removeTeacher: (id: string) => void;

  // Capability actions
  setTeacherCapability: (teacherId: string, subjectCode: string, grades: string[]) => void;

  // Preference actions
  setTeacherPreference: (
    teacherId: string,
    subjectCode: string,
    grade: string,
    priority: 1 | 2 | 3
  ) => void;

  // Navigation actions
  setCurrentStep: (step: FormStep) => void;
  nextStep: () => void;
  prevStep: () => void;

  // Validation actions
  setValidationError: (field: string, error: string) => void;
  clearValidationError: (field: string) => void;
  clearAllValidationErrors: () => void;

  // Reset
  reset: () => void;

  // Validation helpers
  validateStep: (step: FormStep) => boolean;
  canProceed: () => boolean;
}

export type IntakeStore = IntakeState & IntakeActions;

// ============================================================================
// INITIAL STATE
// ============================================================================

const initialSchoolInfo: SchoolInfo = {
  schoolName: '',
  filledBy: '',
  filledAt: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD
};

const initialPolicyConfig: PolicyConfig = {
  generalistsGradeScope: 'no',
  insufficientHours: 'stop',
  unclearData: 'default',
  specialistsExist: 'no',
};

const initialSubjects: Subject[] = [
  {
    id: 'subject-1',
    code: 'ENG',
    name: 'English',
    gradeLevels: { upperPrimary: true, juniorSchool: true },
    doubleLessonsAllowed: false,
  },
];

const initialTeachers: Teacher[] = [
  {
    id: 'teacher-1',
    name: '',
    role: 'generalist',
    maxPeriodsWeek: 0,
    notes: '',
  },
];

const initialState: IntakeState = {
  schoolInfo: initialSchoolInfo,
  policyConfig: initialPolicyConfig,
  subjects: initialSubjects,
  teachers: initialTeachers,
  teacherCapabilities: [],
  teacherPreferences: [],
  currentStep: 1,
  validationErrors: {},
};

// ============================================================================
// STORE DEFINITION
// ============================================================================

export const useIntakeStore = create<IntakeStore>()(
  devtools(
    persist(
      (set, get) => ({
        // State
        ...initialState,

        // ======================================================================
        // ACTIONS
        // ======================================================================

        // School Info
        setSchoolInfo: (info) => {
          set((state) => ({
            schoolInfo: { ...state.schoolInfo, ...info },
          }));
        },

        // Policy Config
        setPolicyConfig: (config) => {
          set((state) => ({
            policyConfig: { ...state.policyConfig, ...config },
          }));
        },

        // Subjects
        addSubject: (subjectData) => {
          const newSubject: Subject = {
            ...subjectData,
            id: `subject-${Date.now()}`,
          };
          set((state) => ({
            subjects: [...state.subjects, newSubject],
          }));
        },

        updateSubject: (id, updates) => {
          set((state) => ({
            subjects: state.subjects.map((subject) =>
              subject.id === id ? { ...subject, ...updates } : subject
            ),
          }));
        },

        removeSubject: (id) => {
          set((state) => ({
            subjects: state.subjects.filter((subject) => subject.id !== id),
          }));
        },

        // Teachers
        addTeacher: (teacherData) => {
          const newTeacher: Teacher = {
            ...teacherData,
            id: `teacher-${Date.now()}`,
          };
          set((state) => ({
            teachers: [...state.teachers, newTeacher],
          }));
        },

        updateTeacher: (id, updates) => {
          set((state) => ({
            teachers: state.teachers.map((teacher) =>
              teacher.id === id ? { ...teacher, ...updates } : teacher
            ),
          }));
        },

        removeTeacher: (id) => {
          // Also remove related capabilities and preferences
          set((state) => ({
            teachers: state.teachers.filter((teacher) => teacher.id !== id),
            teacherCapabilities: state.teacherCapabilities.filter((cap) => cap.teacherId !== id),
            teacherPreferences: state.teacherPreferences.filter((pref) => pref.teacherId !== id),
          }));
        },

        // Capabilities
        setTeacherCapability: (teacherId, subjectCode, grades) => {
          set((state) => {
            // Remove existing capability for this teacher+subject
            const existingCapabilities = state.teacherCapabilities.filter(
              (cap) => !(cap.teacherId === teacherId && cap.subjectCode === subjectCode)
            );

            // Add new capability if grades are not empty
            const newCapabilities =
              grades.length > 0
                ? [...existingCapabilities, { teacherId, subjectCode, grades }]
                : existingCapabilities;

            return { teacherCapabilities: newCapabilities };
          });
        },

        // Preferences
        setTeacherPreference: (teacherId, subjectCode, grade, priority) => {
          set((state) => {
            // Remove existing preference for this teacher+subject+grade
            const existingPreferences = state.teacherPreferences.filter(
              (pref) =>
                !(
                  pref.teacherId === teacherId &&
                  pref.subjectCode === subjectCode &&
                  pref.grade === grade
                )
            );

            // Add new preference
            return {
              teacherPreferences: [
                ...existingPreferences,
                { teacherId, subjectCode, grade, priority },
              ],
            };
          });
        },

        // Navigation
        setCurrentStep: (step) => {
          set({ currentStep: step });
        },

        nextStep: () => {
          const { currentStep } = get();
          if (currentStep < 3) {
            set({ currentStep: (currentStep + 1) as FormStep });
          }
        },

        prevStep: () => {
          const { currentStep } = get();
          if (currentStep > 1) {
            set({ currentStep: (currentStep - 1) as FormStep });
          }
        },

        // Validation
        setValidationError: (field, error) => {
          set((state) => ({
            validationErrors: { ...state.validationErrors, [field]: error },
          }));
        },

        clearValidationError: (field) => {
          set((state) => {
            const newErrors = { ...state.validationErrors };
            delete newErrors[field];
            return { validationErrors: newErrors };
          });
        },

        clearAllValidationErrors: () => {
          set({ validationErrors: {} });
        },

        // Reset
        reset: () => {
          set(initialState);
        },

        // ======================================================================
        // VALIDATION HELPERS
        // ======================================================================

        validateStep: (step: FormStep): boolean => {
          const { schoolInfo, subjects, teachers } = get();
          const errors: Record<string, string> = {};

          switch (step) {
            case 1:
              // Validate School Info
              if (!schoolInfo.schoolName.trim()) {
                errors.schoolName = 'School name is required';
              }
              if (!schoolInfo.filledBy.trim()) {
                errors.filledBy = 'Filled by is required';
              }
              break;

            case 2:
              // Validate Subjects
              if (subjects.length === 0) {
                errors.subjects = 'At least one subject is required';
              }
              for (const subject of subjects) {
                if (!subject.code.trim()) {
                  errors[`subject-${subject.id}-code`] = 'Subject code is required';
                }
                if (!subject.name.trim()) {
                  errors[`subject-${subject.id}-name`] = 'Subject name is required';
                }
              }
              break;

            case 3:
              // Validate Teachers
              if (teachers.length === 0) {
                errors.teachers = 'At least one teacher is required';
              }
              for (const teacher of teachers) {
                if (!teacher.name.trim()) {
                  errors[`teacher-${teacher.id}-name`] = 'Teacher name is required';
                }
                if (teacher.maxPeriodsWeek <= 0) {
                  errors[`teacher-${teacher.id}-maxPeriodsWeek`] =
                    'Max periods must be greater than 0';
                }
              }
              break;
          }

          set({ validationErrors: errors });
          return Object.keys(errors).length === 0;
        },

        canProceed: (): boolean => {
          const { validationErrors } = get();
          return Object.keys(validationErrors).length === 0;
        },
      }),
      {
        name: 'intake-store',
        partialize: (state) => ({
          // Persist all state except validation errors
          schoolInfo: state.schoolInfo,
          policyConfig: state.policyConfig,
          subjects: state.subjects,
          teachers: state.teachers,
          teacherCapabilities: state.teacherCapabilities,
          teacherPreferences: state.teacherPreferences,
          currentStep: state.currentStep,
        }),
      }
    ),
    { name: 'IntakeStore' }
  )
);

// ============================================================================
// SELECTORS (Optimized selectors for performance)
// ============================================================================

export const selectSchoolInfo = (state: IntakeStore) => state.schoolInfo;
export const selectPolicyConfig = (state: IntakeStore) => state.policyConfig;
export const selectSubjects = (state: IntakeStore) => state.subjects;
export const selectTeachers = (state: IntakeStore) => state.teachers;
export const selectCurrentStep = (state: IntakeStore) => state.currentStep;
export const selectValidationErrors = (state: IntakeStore) => state.validationErrors;

// Selector for teacher capabilities by teacher
export const selectTeacherCapabilities = (teacherId: string) => (state: IntakeStore) =>
  state.teacherCapabilities.filter((cap) => cap.teacherId === teacherId);

// Selector for teacher preferences by teacher
export const selectTeacherPreferences = (teacherId: string) => (state: IntakeStore) =>
  state.teacherPreferences.filter((pref) => pref.teacherId === teacherId);

// Selector to check if a teacher can teach a subject at a specific grade
export const canTeacherTeachSubjectAtGrade =
  (teacherId: string, subjectCode: string, grade: string) => (state: IntakeStore) => {
    const capability = state.teacherCapabilities.find(
      (cap) => cap.teacherId === teacherId && cap.subjectCode === subjectCode
    );
    return capability?.grades.includes(grade) || false;
  };

// Selector to get preference for a teacher+subject+grade
export const getTeacherPreference =
  (teacherId: string, subjectCode: string, grade: string) => (state: IntakeStore) => {
    const preference = state.teacherPreferences.find(
      (pref) =>
        pref.teacherId === teacherId && pref.subjectCode === subjectCode && pref.grade === grade
    );
    return preference?.priority || null;
  };

// Selector to get teachers with their capabilities and preferences populated
export const selectTeachersWithCapabilities = (state: IntakeStore) => {
  return state.teachers.map((teacher) => ({
    ...teacher,
    capabilities: state.teacherCapabilities.filter((cap) => cap.teacherId === teacher.id),
    preferences: state.teacherPreferences.filter((pref) => pref.teacherId === teacher.id),
  }));
};

// Selector to get all teacher capabilities
export const selectAllTeacherCapabilities = (state: IntakeStore) => state.teacherCapabilities;

// Selector to get all teacher preferences
export const selectAllTeacherPreferences = (state: IntakeStore) => state.teacherPreferences;
