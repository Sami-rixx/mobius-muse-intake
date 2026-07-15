import React from 'react';
import { motion } from 'framer-motion';
import { useFormStep } from '@/hooks/useFormStep';

interface Step {
  id: number;
  label: string;
  description?: string;
}

const STEPS: Step[] = [
  { id: 1, label: 'School & Policy', description: 'Basic school information and policy configurations' },
  { id: 2, label: 'Subject Roster', description: 'Define subjects and their grade band applicability' },
  { id: 3, label: 'Teachers', description: 'Add teachers with their capabilities and preferences' },
];

export const StepIndicator: React.FC = () => {
  const { currentStep } = useFormStep();

  return (
    <div className="w-full max-w-3xl mx-auto py-6">
      {/* Continuous flow line with Möbius motif */}
      <div className="relative h-1 mb-6">
        <div className="absolute inset-0 h-1 bg-headerBlue/20 rounded-full" />

        {/* Active progress line */}
        <motion.div
          className="absolute h-1 bg-gradient-to-r from-accentTeal to-brushedBrass rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {/* Möbius strip overlay (subtle) */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 10" preserveAspectRatio="none">
            <path
              d="M0,5 Q25,0 50,5 T100,5"
              stroke="#1B3A5C"
              strokeWidth="2"
              fill="none"
              strokeDasharray="4,2"
            />
          </svg>
        </div>
      </div>

      {/* Step labels */}
      <div className="flex justify-between items-center">
        {STEPS.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                font-mono text-sm transition-all duration-300
                ${currentStep === step.id
                  ? 'bg-brushedBrass text-deepMuseBlue ring-4 ring-brushedBrass/30'
                  : currentStep > step.id
                  ? 'bg-accentTeal text-white'
                  : 'bg-headerBlue/20 text-textMuted'
                }
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.id}
            </motion.div>

            <div className="mt-3 text-center">
              <p
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${currentStep === step.id
                    ? 'text-brushedBrass'
                    : 'text-textSecondary'
                  }
                `}
              >
                {step.label}
              </p>
              <p className="text-xs text-textMuted mt-1 max-w-[200px]">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
