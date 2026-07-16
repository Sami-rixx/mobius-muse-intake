import React, { useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormStep } from '@/hooks/useFormStep';
import { useIntakeStore } from '@/store/useIntakeStore';
import { POLICY_QUESTIONS } from '@/lib/constants';

export const Step1: React.FC = () => {
  const { navigate, canGoNext, validationErrors, hasCurrentStepErrors } = useFormStep();
  const { schoolInfo, policyConfig, setSchoolInfo, setPolicyConfig } = useIntakeStore();

  // Policy options for select inputs
  const policyOptions = [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' },
  ];

  const insufficientHoursOptions = [
    { value: 'stop', label: 'Stop and tell me' },
    { value: 'go', label: 'Go ahead anyway' },
  ];

  const unclearDataOptions = [
    { value: 'default', label: 'Use sensible default' },
    { value: 'resolve', label: 'Stop and resolve' },
  ];

  // Handle input changes
  const handleSchoolInfoChange = (field: keyof typeof schoolInfo, value: string) => {
    setSchoolInfo({ [field]: value });
  };

  const handlePolicyChange = (field: keyof typeof policyConfig, value: string) => {
    // Cast value to the appropriate type based on the field
    const typedValue = value as (typeof policyConfig)[typeof field];
    setPolicyConfig({ [field]: typedValue });
  };

  // Scroll to first error on mount if there are errors
  useEffect(() => {
    if (hasCurrentStepErrors()) {
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.focus();
      }
    }
  }, [validationErrors, hasCurrentStepErrors]);

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="mb-1 font-display text-xl font-bold text-textPrimary">School Information</h2>
        <p className="text-sm text-textMuted">Enter basic information about your school</p>
      </div>

      <div className="space-y-4">
        <Input
          id="schoolName"
          label="School Name"
          placeholder="Enter school name"
          required
          value={schoolInfo.schoolName}
          onChange={(e) => handleSchoolInfoChange('schoolName', e.target.value)}
          error={validationErrors.schoolName}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="filledBy"
            label="Filled By"
            placeholder="Your name"
            required
            value={schoolInfo.filledBy}
            onChange={(e) => handleSchoolInfoChange('filledBy', e.target.value)}
            error={validationErrors.filledBy}
          />
          <Input
            id="filledAt"
            label="Date"
            type="date"
            required
            value={schoolInfo.filledAt}
            onChange={(e) => handleSchoolInfoChange('filledAt', e.target.value)}
          />
        </div>
      </div>

      <div className="border-t border-headerBlue/20 pt-4">
        <h3 className="mb-1 font-display text-lg font-semibold text-textPrimary">
          Policy Configurations
        </h3>
        <p className="mb-4 text-sm text-textMuted">
          Define how the system should handle various scenarios
        </p>

        <div className="space-y-4">
          {POLICY_QUESTIONS.map((question) => {
            // Map question IDs to our state fields
            const fieldMap: Record<string, keyof typeof policyConfig> = {
              q1: 'generalistsGradeScope',
              q2: 'insufficientHours',
              q3: 'unclearData',
              q4: 'specialistsExist',
            };

            const field = fieldMap[question.id];
            const value = policyConfig[field];

            // Determine which options to use
            let options = policyOptions;
            if (question.id === 'q2') {
              options = insufficientHoursOptions;
            } else if (question.id === 'q3') {
              options = unclearDataOptions;
            }

            return (
              <Select
                key={question.id}
                id={question.id}
                label={question.question}
                options={options}
                hint={question.description}
                value={value}
                onChange={(e) => handlePolicyChange(field, e.target.value)}
              />
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="accent" onClick={() => navigate('next')} disabled={!canGoNext}>
          Continue to Subjects
        </Button>
      </div>
    </Card>
  );
};
