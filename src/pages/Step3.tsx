import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ToggleChip } from '@/components/ui/ToggleChip';
import { useFormStep } from '@/hooks/useFormStep';
import { ALL_GRADES, PREDEFINED_SUBJECTS } from '@/lib/constants';

export const Step3: React.FC = () => {
  const { navigate, canGoNext } = useFormStep();

  const roleOptions = [
    { value: 'generalist', label: 'Generalist' },
    { value: 'specialist', label: 'Specialist' },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-display font-semibold text-textPrimary">
              Teacher 1
            </h3>
            <span className="font-mono text-textMuted">T1</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Teacher Name"
              placeholder="Enter teacher name"
              required
            />
            <Select
              label="Role"
              options={roleOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Max Periods/Week"
              type="number"
              placeholder="0"
            />
            <Input
              label="Notes"
              placeholder="Any exceptions or notes"
            />
          </div>

          <div className="pt-4 border-t border-headerBlue/20">
            <p className="text-sm text-textMuted mb-3">
              Subject Capabilities & Preferences:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 pr-4 text-sm text-textMuted font-mono">
                      Subject
                    </th>
                    {ALL_GRADES.map((grade) => (
                      <th key={grade} className="py-2 px-2 text-center text-sm text-textMuted font-mono">
                        {grade}
                      </th>
                    ))}
                    <th className="py-2 pl-4 text-sm text-textMuted">Priority</th>
                  </tr>
                </thead>
                <tbody>
                  {PREDEFINED_SUBJECTS.map((subject) => (
                    <tr key={subject.code} className="border-t border-headerBlue/10">
                      <td className="py-3 pr-4">
                        <div>
                          <span className="font-mono text-accentTeal">{subject.code}</span>
                          <span className="ml-2 text-textSecondary">{subject.name}</span>
                        </div>
                      </td>
                      {ALL_GRADES.map((grade) => {
                        const isNA = subject.naGradeBands.includes(
                          grade <= 'G6' ? 'upperPrimary' : 'juniorSchool'
                        );
                        return (
                          <td key={grade} className="py-2 px-2 text-center">
                            {isNA ? (
                              <span className="text-textMuted text-xs">N/A</span>
                            ) : (
                              <ToggleChip
                                label=""
                                selected={true}
                                priority={1}
                                onClick={() => {}}
                                size="sm"
                              />
                            )}
                          </td>
                        );
                      })}
                      <td className="py-3 pl-4">
                        <Select
                          options={[
                            { value: '1', label: 'Preferred' },
                            { value: '2', label: 'Normal' },
                            { value: '3', label: 'Last Resort' },
                          ]}
                          className="w-32"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>

      <Button variant="secondary" className="w-full">
        + Add Another Teacher
      </Button>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={() => navigate('prev')}>
          Back to Subjects
        </Button>
        <Button
          variant="accent"
          onClick={() => navigate('next')}
          disabled={!canGoNext}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  );
};
