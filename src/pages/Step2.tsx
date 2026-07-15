import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { useFormStep } from '@/hooks/useFormStep';
import { ALL_GRADES } from '@/lib/constants';

export const Step2: React.FC = () => {
  const { navigate, canGoNext } = useFormStep();

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-bold text-textPrimary mb-1">
          Subject Roster
        </h2>
        <p className="text-textMuted text-sm">
          Define subjects and their applicable grade bands
        </p>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-headerBlue/10 rounded-lg space-y-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-accentTeal">ENG</span>
            <span className="text-textPrimary">English</span>
          </div>

          <div>
            <p className="text-sm text-textMuted mb-2">Grade Bands:</p>
            <div className="flex flex-wrap gap-2">
              {ALL_GRADES.map((grade) => (
                <ToggleChip
                  key={grade}
                  label={grade}
                  selected={true}
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded" />
              <span className="text-textSecondary">Double lessons allowed</span>
            </label>
          </div>
        </div>

        <Button variant="secondary" className="w-full">
          + Add Another Subject
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('prev')}>
          Back to School & Policy
        </Button>
        <Button
          variant="accent"
          onClick={() => navigate('next')}
          disabled={!canGoNext}
        >
          Continue to Teachers
        </Button>
      </div>
    </Card>
  );
};
