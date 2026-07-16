import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PriorityBadge } from '@/components/ui/PriorityBadge';
import { useFormStep } from '@/hooks/useFormStep';
import { useIntakeStore, selectTeachersWithCapabilities } from '@/store/useIntakeStore';
import { useGatecheckerPayload } from '@/lib/transformers/toGatecheckerFormat';
import {
  submitFromStore as submitFromStoreApi,
  downloadIntakeData,
  logIntakeData,
} from '@/lib/api/intakeApi';
import { POLICY_QUESTIONS } from '@/lib/constants';

export const Review: React.FC = () => {
  const { navigate } = useFormStep();
  const store = useIntakeStore();
  const teachersWithCaps = useIntakeStore(selectTeachersWithCapabilities);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    error?: string;
  } | null>(null);

  // Get the transformed payload
  const payload = useGatecheckerPayload();

  // Handle submission
  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const result = await submitFromStoreApi(store);

      if (result.success) {
        setSubmitResult({
          success: true,
          message: result.message || 'Submission successful!',
        });

        // Navigate to success page after a short delay
        setTimeout(() => {
          navigate('next');
        }, 1500);
      } else {
        setSubmitResult({
          success: false,
          message: result.message || 'Submission failed',
          error: result.error,
        });
      }
    } catch (error) {
      setSubmitResult({
        success: false,
        message: 'An error occurred',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Map policy values to display labels
  const policyLabels: Record<string, Record<string, string>> = {
    generalistsGradeScope: {
      no: 'Generalists can only teach explicitly defined grades',
      yes: 'Generalists can teach any grade',
    },
    insufficientHours: {
      stop: 'Stop and tell me',
      go: 'Go ahead anyway',
    },
    unclearData: {
      default: 'Use sensible default',
      resolve: 'Stop and resolve',
    },
    specialistsExist: {
      yes: 'Specialists exist in this school',
      no: 'No specialists in this school',
    },
  };

  // Map role to display label
  const roleLabels: Record<string, string> = {
    generalist: 'Generalist',
    specialist: 'Specialist',
  };

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-textPrimary">Review Your Data</h2>
        <p className="text-sm text-textMuted">
          Please review all information before submission to Gatechecker
        </p>
      </div>

      {/* Submission Result Message */}
      {submitResult && (
        <div
          className={`rounded-lg p-4 ${submitResult.success ? 'border border-success bg-success/20' : 'border border-error bg-error/20'}`}
        >
          <p className={submitResult.success ? 'text-success' : 'text-error'}>
            {submitResult.message}
          </p>
          {submitResult.error && (
            <p className="mt-1 text-sm text-textMuted">{submitResult.error}</p>
          )}
        </div>
      )}

      <div className="space-y-4">
        {/* School & Policy Section */}
        <Card variant="bordered" padding="md">
          <h3 className="mb-3 font-display text-lg font-semibold text-brushedBrass">
            🏫 School & Policy
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <p className="mb-1 text-sm text-textMuted">School Name</p>
              <p className="text-textPrimary">{store.schoolInfo.schoolName || 'Not specified'}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-textMuted">Filled By</p>
              <p className="text-textPrimary">{store.schoolInfo.filledBy || 'Not specified'}</p>
            </div>
            <div>
              <p className="mb-1 text-sm text-textMuted">Date</p>
              <p className="text-textPrimary">{formatDate(store.schoolInfo.filledAt)}</p>
            </div>
          </div>

          <div className="mt-6 border-t border-headerBlue/20 pt-4">
            <h4 className="mb-3 text-sm font-medium text-textSecondary">Policy Configurations</h4>
            <div className="space-y-2">
              {Object.entries(store.policyConfig).map(([key, value]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="text-textMuted">•</span>
                  <span className="text-textPrimary">
                    {POLICY_QUESTIONS.find(
                      (q) =>
                        q.id ===
                        `q${Object.keys(store.policyConfig).indexOf(key as keyof typeof store.policyConfig) + 1}`
                    )?.question || key}
                  </span>
                  <span className="ml-auto text-brushedBrass">
                    {policyLabels[key as keyof typeof policyLabels]?.[value as string] || value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Subject Roster Section */}
        <Card variant="bordered" padding="md">
          <h3 className="mb-3 font-display text-lg font-semibold text-brushedBrass">
            📚 Subject Roster
          </h3>

          {store.subjects.length === 0 ? (
            <p className="text-sm text-textMuted">No subjects defined</p>
          ) : (
            <div className="space-y-3">
              {store.subjects.map((subject) => (
                <div key={subject.id} className="rounded-lg bg-headerBlue/10 p-3">
                  <div className="mb-2 flex items-center gap-3">
                    <span className="font-mono text-accentTeal">{subject.code}</span>
                    <span className="text-textPrimary">{subject.name}</span>
                  </div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <span className="text-sm text-textMuted">Grade Bands:</span>
                    {subject.gradeLevels.upperPrimary && (
                      <span className="rounded bg-headerBlue/30 px-2 py-0.5 text-xs">
                        Upper Primary (G4-G6)
                      </span>
                    )}
                    {subject.gradeLevels.juniorSchool && (
                      <span className="rounded bg-headerBlue/30 px-2 py-0.5 text-xs">
                        Junior School (G7-G9)
                      </span>
                    )}
                  </div>
                  {subject.doubleLessonsAllowed && (
                    <span className="text-sm text-accentTeal">✓ Double lessons allowed</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Teachers Section */}
        <Card variant="bordered" padding="md">
          <h3 className="mb-3 font-display text-lg font-semibold text-brushedBrass">👨‍🏫 Teachers</h3>

          {teachersWithCaps.length === 0 ? (
            <p className="text-sm text-textMuted">No teachers defined</p>
          ) : (
            <div className="space-y-4">
              {teachersWithCaps.map((teacher, index) => (
                <div key={teacher.id} className="rounded-lg bg-headerBlue/10 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-textMuted">T{index + 1}</span>
                      <span className="font-medium text-textPrimary">{teacher.name}</span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          teacher.role === 'specialist'
                            ? 'bg-brushedBrass text-deepMuseBlue'
                            : 'bg-headerBlue/30 text-textSecondary'
                        }`}
                      >
                        {roleLabels[teacher.role]}
                      </span>
                    </div>
                  </div>

                  <div className="mb-2 grid grid-cols-1 gap-2 md:grid-cols-2">
                    <div>
                      <p className="mb-1 text-sm text-textMuted">Max Periods/Week</p>
                      <p className="text-textPrimary">{teacher.maxPeriodsWeek}</p>
                    </div>
                    {teacher.notes && (
                      <div>
                        <p className="mb-1 text-sm text-textMuted">Notes</p>
                        <p className="text-textPrimary">{teacher.notes}</p>
                      </div>
                    )}
                  </div>

                  {/* Teacher Capabilities */}
                  <div className="border-t border-headerBlue/20 pt-2">
                    <p className="mb-2 text-sm text-textMuted">Can teach:</p>
                    <div className="space-y-1">
                      {store.subjects.map((subject) => {
                        const capabilities = teacher.capabilities?.filter(
                          (cap) => cap.subjectCode === subject.code
                        );

                        if (!capabilities || capabilities.length === 0) return null;

                        const grades = capabilities[0].grades;
                        return (
                          <div key={subject.code} className="flex items-center gap-2">
                            <span className="font-mono text-sm text-accentTeal">
                              {subject.code}
                            </span>
                            <span className="text-sm text-textSecondary">{subject.name}</span>
                            <div className="ml-auto flex flex-wrap gap-1">
                              {grades.map((grade) => (
                                <span
                                  key={grade}
                                  className="rounded bg-headerBlue/30 px-1.5 py-0.5 text-xs"
                                >
                                  {grade}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Teacher Preferences */}
                  <div className="border-t border-headerBlue/20 pt-2">
                    <p className="mb-2 text-sm text-textMuted">Preferences:</p>
                    <div className="space-y-1">
                      {teacher.preferences?.map((pref, prefIndex) => {
                        const subject = store.subjects.find((s) => s.code === pref.subjectCode);
                        return (
                          <div key={prefIndex} className="flex items-center gap-2">
                            <span className="font-mono text-sm text-accentTeal">
                              {pref.subjectCode}
                            </span>
                            <span className="text-sm text-textSecondary">{subject?.name}</span>
                            <span className="text-sm text-textMuted">at {pref.grade}</span>
                            <PriorityBadge priority={pref.priority} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between pt-4">
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => logIntakeData(payload)}>
            📋 Log Data
          </Button>
          <Button variant="secondary" onClick={() => downloadIntakeData(payload)}>
            💾 Download JSON
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={() => navigate('prev')}>
            Back to Teachers
          </Button>
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit to Gatechecker'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
