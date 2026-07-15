import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useFormStep } from '@/hooks/useFormStep';

export const Review: React.FC = () => {
  const { navigate } = useFormStep();

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-textPrimary mb-1">
          Review Your Data
        </h2>
        <p className="text-textMuted text-sm">
          Please review all information before submission
        </p>
      </div>

      <div className="space-y-4">
        <Card variant="bordered" padding="md">
          <h3 className="text-lg font-display font-semibold text-brushedBrass mb-3">
            School & Policy
          </h3>
          <p className="text-textMuted">School information and policy configurations will appear here.</p>
        </Card>

        <Card variant="bordered" padding="md">
          <h3 className="text-lg font-display font-semibold text-brushedBrass mb-3">
            Subject Roster
          </h3>
          <p className="text-textMuted">Subject definitions will appear here.</p>
        </Card>

        <Card variant="bordered" padding="md">
          <h3 className="text-lg font-display font-semibold text-brushedBrass mb-3">
            Teachers
          </h3>
          <p className="text-textMuted">Teacher information will appear here.</p>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('prev')}>
          Back to Teachers
        </Button>
        <Button variant="accent" onClick={() => navigate('next')}>
          Submit to Gatechecker
        </Button>
      </div>
    </Card>
  );
};
