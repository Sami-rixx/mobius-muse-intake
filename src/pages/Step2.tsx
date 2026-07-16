import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { useFormStep } from '@/hooks/useFormStep';
import { useIntakeStore, selectSubjects } from '@/store/useIntakeStore';
import { ALL_GRADES } from '@/lib/constants';
import { PREDEFINED_SUBJECTS } from '@/lib/constants/subjects';

export const Step2: React.FC = () => {
  const { navigate, canGoNext } = useFormStep();
  const subjects = useIntakeStore(selectSubjects);
  const { addSubject, updateSubject, removeSubject } = useIntakeStore();

  // State for new subject form
  const [showAddSubject, setShowAddSubject] = useState(false);
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newSubjectName, setNewSubjectName] = useState('');

  // Get predefined subject suggestions
  const usedCodes = subjects.map((s) => s.code);
  const availablePredefined = PREDEFINED_SUBJECTS.filter((s) => !usedCodes.includes(s.code));

  // Handle grade band toggle
  const handleGradeBandToggle = (subjectId: string, band: 'upperPrimary' | 'juniorSchool') => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      updateSubject(subjectId, {
        gradeLevels: {
          ...subject.gradeLevels,
          [band]: !subject.gradeLevels[band],
        },
      });
    }
  };

  // Handle double lessons toggle
  const handleDoubleLessonsToggle = (subjectId: string) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      updateSubject(subjectId, {
        doubleLessonsAllowed: !subject.doubleLessonsAllowed,
      });
    }
  };

  // Add a predefined subject
  const handleAddPredefinedSubject = (code: string) => {
    const predefined = PREDEFINED_SUBJECTS.find((s) => s.code === code);
    if (predefined) {
      addSubject({
        code: predefined.code,
        name: predefined.name,
        gradeLevels: { upperPrimary: true, juniorSchool: true },
        doubleLessonsAllowed: false,
      });
    }
  };

  // Add a custom subject
  const handleAddCustomSubject = () => {
    if (newSubjectCode.trim() && newSubjectName.trim()) {
      addSubject({
        code: newSubjectCode.trim().toUpperCase(),
        name: newSubjectName.trim(),
        gradeLevels: { upperPrimary: true, juniorSchool: true },
        doubleLessonsAllowed: false,
      });
      setNewSubjectCode('');
      setNewSubjectName('');
      setShowAddSubject(false);
    }
  };

  // Check if a grade is available for a subject
  const isGradeAvailable = (subjectCode: string, grade: string): boolean => {
    const predefined = PREDEFINED_SUBJECTS.find((s) => s.code === subjectCode);
    if (!predefined) return true;

    // Check if grade is in N/A bands
    const gradeBand = grade <= 'G6' ? 'upperPrimary' : 'juniorSchool';
    return !predefined.naGradeBands.includes(gradeBand);
  };

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-textPrimary">Subject Roster</h2>
        <p className="text-sm text-textMuted">Define subjects and their applicable grade bands</p>
      </div>

      <div className="space-y-4">
        {subjects.map((subject) => (
          <div key={subject.id} className="space-y-3 rounded-lg bg-headerBlue/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-accentTeal">{subject.code}</span>
                <span className="text-textPrimary">{subject.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeSubject(subject.id)}
                className="text-error hover:text-error/80"
              >
                × Remove
              </Button>
            </div>

            <div>
              <p className="mb-2 text-sm text-textMuted">Grade Bands:</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(subject.gradeLevels).map(([band, enabled]) => {
                  const bandLabel = band === 'upperPrimary' ? 'Upper Primary' : 'Junior School';
                  return (
                    <ToggleChip
                      key={band}
                      label={bandLabel}
                      selected={enabled}
                      onClick={() =>
                        handleGradeBandToggle(subject.id, band as 'upperPrimary' | 'juniorSchool')
                      }
                    />
                  );
                })}
              </div>
            </div>

            {/* Individual grade toggles */}
            <div className="pt-2">
              <p className="mb-2 text-sm text-textMuted">Available Grades:</p>
              <div className="flex flex-wrap gap-1">
                {ALL_GRADES.map((grade) => {
                  const isUpperPrimary = grade <= 'G6';
                  const band = isUpperPrimary ? 'upperPrimary' : 'juniorSchool';
                  const isEnabled = subject.gradeLevels[band];
                  const isNA = !isGradeAvailable(subject.code, grade);

                  return (
                    <ToggleChip
                      key={grade}
                      label={grade}
                      selected={isEnabled && !isNA}
                      disabled={!isEnabled || isNA}
                      size="sm"
                      onClick={() => {}}
                    />
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2 text-sm">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={subject.doubleLessonsAllowed}
                  onChange={() => handleDoubleLessonsToggle(subject.id)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-textSecondary">Double lessons allowed</span>
              </label>
            </div>
          </div>
        ))}

        {/* Add Subject Section */}
        <div className="space-y-3">
          {showAddSubject ? (
            <div className="space-y-3 rounded-lg bg-headerBlue/10 p-4">
              <h4 className="text-sm font-medium text-textPrimary">Add Custom Subject</h4>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <input
                  type="text"
                  placeholder="Subject Code (e.g., MATH)"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  className="w-full rounded border border-headerBlue/30 bg-headerBlue/20 px-3 py-2 text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-brushedBrass"
                />
                <input
                  type="text"
                  placeholder="Subject Name (e.g., Mathematics)"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full rounded border border-headerBlue/30 bg-headerBlue/20 px-3 py-2 text-textPrimary placeholder:text-textMuted focus:outline-none focus:ring-2 focus:ring-brushedBrass"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleAddCustomSubject}
                  disabled={!newSubjectCode.trim() || !newSubjectName.trim()}
                >
                  Add Subject
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowAddSubject(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {availablePredefined.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {availablePredefined.map((predefined) => (
                    <Button
                      key={predefined.code}
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddPredefinedSubject(predefined.code)}
                      className="flex items-center gap-2"
                    >
                      <span className="font-mono text-accentTeal">{predefined.code}</span>
                      <span>{predefined.name}</span>
                    </Button>
                  ))}
                </div>
              )}

              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowAddSubject(true)}
              >
                + Add Custom Subject
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('prev')}>
          Back to School & Policy
        </Button>
        <Button variant="accent" onClick={() => navigate('next')} disabled={!canGoNext}>
          Continue to Teachers
        </Button>
      </div>
    </Card>
  );
};
