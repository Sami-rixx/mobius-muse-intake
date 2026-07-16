import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ToggleChip } from '@/components/ui/ToggleChip';

import { useFormStep } from '@/hooks/useFormStep';
import {
  useIntakeStore,
  selectTeachersWithCapabilities,
  selectSubjects,
} from '@/store/useIntakeStore';
import { ALL_GRADES } from '@/lib/constants';
import { PREDEFINED_SUBJECTS } from '@/lib/constants/subjects';

export const Step3: React.FC = () => {
  const { navigate, canGoNext } = useFormStep();
  const teachers = useIntakeStore(selectTeachersWithCapabilities);
  const subjects = useIntakeStore(selectSubjects);
  const { addTeacher, updateTeacher, removeTeacher, setTeacherCapability, setTeacherPreference } =
    useIntakeStore();

  // State for new teacher form
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherRole, setNewTeacherRole] = useState<'generalist' | 'specialist'>('generalist');
  const [newTeacherMaxPeriods, setNewTeacherMaxPeriods] = useState(0);

  // Role options
  const roleOptions = [
    { value: 'generalist', label: 'Generalist' },
    { value: 'specialist', label: 'Specialist' },
  ];

  // Priority options
  const priorityOptions = [
    { value: '1', label: 'Preferred' },
    { value: '2', label: 'Normal' },
    { value: '3', label: 'Last Resort' },
  ];

  // Add a new teacher
  const handleAddTeacher = () => {
    if (newTeacherName.trim()) {
      addTeacher({
        name: newTeacherName.trim(),
        role: newTeacherRole,
        maxPeriodsWeek: newTeacherMaxPeriods,
        notes: '',
      });
      setNewTeacherName('');
      setNewTeacherRole('generalist');
      setNewTeacherMaxPeriods(0);
      setShowAddTeacher(false);
    }
  };

  // Handle capability toggle for a teacher+subject+grade
  const handleCapabilityToggle = (
    teacherId: string,
    subjectCode: string,
    grade: string,
    currentState: boolean
  ) => {
    // Get current capabilities for this teacher+subject
    const currentCaps = teachers
      .find((t) => t.id === teacherId)
      ?.capabilities?.find((c) => c.subjectCode === subjectCode);

    let newGrades: string[];
    if (currentState) {
      // Remove grade from capabilities
      newGrades = currentCaps?.grades.filter((g) => g !== grade) || [];
    } else {
      // Add grade to capabilities
      newGrades = [...(currentCaps?.grades || []), grade];
    }

    setTeacherCapability(teacherId, subjectCode, newGrades);
  };

  // Handle preference change
  const handlePreferenceChange = (
    teacherId: string,
    subjectCode: string,
    grade: string,
    priority: 1 | 2 | 3
  ) => {
    setTeacherPreference(teacherId, subjectCode, grade, priority);
  };

  // Check if teacher can teach subject at grade
  const canTeach = (teacherId: string, subjectCode: string, grade: string): boolean => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return false;

    // Check capabilities
    const capability = teacher.capabilities?.find((c) => c.subjectCode === subjectCode);
    return capability?.grades.includes(grade) || false;
  };

  // Get preference for teacher+subject+grade
  const getPreference = (
    teacherId: string,
    subjectCode: string,
    grade: string
  ): 1 | 2 | 3 | null => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return null;

    const preference = teacher.preferences?.find(
      (p) => p.subjectCode === subjectCode && p.grade === grade
    );
    return preference?.priority || null;
  };

  // Check if subject is N/A for a grade
  const isSubjectNA = (subjectCode: string, grade: string): boolean => {
    const predefined = PREDEFINED_SUBJECTS.find((s) => s.code === subjectCode);
    if (!predefined) return false;

    const gradeBand = grade <= 'G6' ? 'upperPrimary' : 'juniorSchool';
    return predefined.naGradeBands.includes(gradeBand);
  };

  return (
    <div className="space-y-6">
      {teachers.map((teacher, teacherIndex) => (
        <Card key={teacher.id} className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="font-display text-lg font-semibold text-textPrimary">
                Teacher {teacherIndex + 1}
              </h3>
              <span className="font-mono text-textMuted">T{teacherIndex + 1}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => removeTeacher(teacher.id)}
              className="text-error hover:text-error/80"
            >
              × Remove
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Teacher Name"
              placeholder="Enter teacher name"
              required
              value={teacher.name}
              onChange={(e) => updateTeacher(teacher.id, { name: e.target.value })}
            />
            <Select
              label="Role"
              options={roleOptions}
              value={teacher.role}
              onChange={(e) =>
                updateTeacher(teacher.id, { role: e.target.value as 'generalist' | 'specialist' })
              }
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Max Periods/Week"
              type="number"
              placeholder="0"
              min={0}
              value={teacher.maxPeriodsWeek}
              onChange={(e) =>
                updateTeacher(teacher.id, { maxPeriodsWeek: parseInt(e.target.value) || 0 })
              }
            />
            <Input
              label="Notes"
              placeholder="Any exceptions or notes"
              value={teacher.notes}
              onChange={(e) => updateTeacher(teacher.id, { notes: e.target.value })}
            />
          </div>

          <div className="border-t border-headerBlue/20 pt-4">
            <p className="mb-3 text-sm text-textMuted">Subject Capabilities & Preferences:</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="py-2 pr-4 text-left font-mono text-sm text-textMuted">
                      Subject
                    </th>
                    {ALL_GRADES.map((grade) => (
                      <th
                        key={grade}
                        className="px-2 py-2 text-center font-mono text-sm text-textMuted"
                      >
                        {grade}
                      </th>
                    ))}
                    <th className="py-2 pl-4 text-sm text-textMuted">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {subjects.map((subject) => (
                    <tr key={subject.code} className="border-t border-headerBlue/10">
                      <td className="py-3 pr-4">
                        <div>
                          <span className="font-mono text-accentTeal">{subject.code}</span>
                          <span className="ml-2 text-textSecondary">{subject.name}</span>
                        </div>
                      </td>
                      {ALL_GRADES.map((grade) => {
                        const isNA = isSubjectNA(subject.code, grade);
                        const isCapable = canTeach(teacher.id, subject.code, grade);
                        const preference = getPreference(teacher.id, subject.code, grade);

                        return (
                          <td key={grade} className="px-2 py-2 text-center">
                            {isNA ? (
                              <span className="text-xs text-textMuted">N/A</span>
                            ) : (
                              <ToggleChip
                                label=""
                                selected={isCapable}
                                priority={preference || undefined}
                                onClick={() =>
                                  handleCapabilityToggle(teacher.id, subject.code, grade, isCapable)
                                }
                                size="sm"
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3 pl-4">
                        <Select
                          options={priorityOptions}
                          value={String(
                            getPreference(teacher.id, subject.code, ALL_GRADES[0]) || ''
                          )}
                          onChange={(e) => {
                            const priority = parseInt(e.target.value) as 1 | 2 | 3;
                            // Apply to all grades where teacher is capable
                            ALL_GRADES.forEach((grade) => {
                              if (canTeach(teacher.id, subject.code, grade)) {
                                handlePreferenceChange(teacher.id, subject.code, grade, priority);
                              }
                            });
                          }}
                          className="w-32"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ))}

      {/* Add Teacher Section */}
      {showAddTeacher ? (
        <Card className="bg-headerBlue/10 p-4">
          <h4 className="mb-3 text-sm font-medium text-textPrimary">Add New Teacher</h4>
          <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              label="Teacher Name"
              placeholder="Enter teacher name"
              required
              value={newTeacherName}
              onChange={(e) => setNewTeacherName(e.target.value)}
            />
            <Select
              label="Role"
              options={roleOptions}
              value={newTeacherRole}
              onChange={(e) => setNewTeacherRole(e.target.value as 'generalist' | 'specialist')}
            />
            <Input
              label="Max Periods/Week"
              type="number"
              placeholder="0"
              min={0}
              value={newTeacherMaxPeriods}
              onChange={(e) => setNewTeacherMaxPeriods(parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="accent"
              size="sm"
              onClick={handleAddTeacher}
              disabled={!newTeacherName.trim()}
            >
              Add Teacher
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowAddTeacher(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      ) : (
        <Button variant="secondary" className="w-full" onClick={() => setShowAddTeacher(true)}>
          + Add Another Teacher
        </Button>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('prev')}>
          Back to Subjects
        </Button>
        <Button variant="accent" onClick={() => navigate('next')} disabled={!canGoNext}>
          Continue to Review
        </Button>
      </div>
    </div>
  );
};
