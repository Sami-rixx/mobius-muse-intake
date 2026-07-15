import { useState, useCallback } from 'react';
import { FormStep, NavigationDirection } from '@/types';

export const useFormStep = () => {
  const [currentStep, setCurrentStep] = useState<FormStep>(1);

  const totalSteps = 3;

  const navigate = useCallback(
    (direction: NavigationDirection) => {
      setCurrentStep((prev) => {
        if (direction === 'next' && prev < totalSteps) {
          return prev + 1 as FormStep;
        }
        if (direction === 'prev' && prev > 1) {
          return prev - 1 as FormStep;
        }
        return prev;
      });
    },
    [totalSteps]
  );

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step);
  }, []);

  const canGoNext = currentStep < totalSteps;
  const canGoPrev = currentStep > 1;

  return {
    currentStep,
    navigate,
    goToStep,
    canGoNext,
    canGoPrev,
    totalSteps,
  };
};
