import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useFormStep } from '@/hooks/useFormStep';

export const Step1: React.FC = () => {
  const { navigate, canGoNext } = useFormStep();

  const policyOptions = [
    { value: 'no', label: 'No' },
    { value: 'yes', label: 'Yes' },
  ];

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-textPrimary mb-1">
          School Information
        </h2>
        <p className="text-textMuted text-sm">
          Enter basic information about your school
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="School Name"
          placeholder="Enter school name"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Filled By"
            placeholder="Your name"
            required
          />
          <Input
            label="Date"
            type="date"
            required
          />
        </div>
      </div>

      <div className="pt-4 border-t border-headerBlue/20">
        <h3 className="text-lg font-display font-semibold text-textPrimary mb-1">
          Policy Configurations
        </h3>
        <p className="text-textMuted text-sm mb-4">
          Define how the system should handle various scenarios
        </p>

        <div className="space-y-4">
          <Select
            label="Can generalists teach any grade?"
            options={policyOptions}
            hint="Determines if generalist teachers can be assigned to any grade"
          />

          <Select
            label="What to do with insufficient hours?"
            options={policyOptions}
            hint="Determines behavior when teacher capacity is exceeded"
          />

          <Select
            label="What to do with unclear data?"
            options={policyOptions}
            hint="Determines how to handle ambiguous or incomplete data"
          />

          <Select
            label="Do specialists exist in this school?"
            options={policyOptions}
            hint="Determines if specialist teacher constraints should be enforced"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="accent"
          onClick={() => navigate('next')}
          disabled={!canGoNext}
        >
          Continue to Subjects
        </Button>
      </div>
    </Card>
  );
};
