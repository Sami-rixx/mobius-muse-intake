import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormStep, NavigationDirection } from '@/types';
import { useIntakeStore } from '@/store/useIntakeStore';

/**
 * Custom hook for managing form navigation with validation
 * This hook integrates with the Zustand store to manage form state and validation
 */
export const useFormStep = () => {
  const routerNavigate = useNavigate();
  const {
    currentStep,
    setCurrentStep,
    nextStep: storeNextStep,
    prevStep: storePrevStep,
    validateStep,
    canProceed,
    validationErrors,
    clearAllValidationErrors,
  } = useIntakeStore();

  const totalSteps = 3;

  /**
   * Navigate to next or previous step with validation
   */
  const handleNavigate = useCallback(
    (direction: NavigationDirection) => {
      if (direction === 'next') {
        // Validate current step before proceeding
        const isValid = validateStep(currentStep);
        if (!isValid) {
          return; // Don't proceed if validation fails
        }

        // Clear errors for next step
        clearAllValidationErrors();

        // Move to next step
        storeNextStep();

        // Navigate to the appropriate route
        if (currentStep === 1) {
          routerNavigate('/step2');
        } else if (currentStep === 2) {
          routerNavigate('/step3');
        } else if (currentStep === 3) {
          routerNavigate('/review');
        }
      } else if (direction === 'prev') {
        // Clear errors when going back
        clearAllValidationErrors();

        // Move to previous step
        storePrevStep();

        // Navigate to the appropriate route
        if (currentStep === 2) {
          routerNavigate('/step1');
        } else if (currentStep === 3) {
          routerNavigate('/step2');
        }
      }
    },
    [
      currentStep,
      routerNavigate,
      storeNextStep,
      storePrevStep,
      validateStep,
      clearAllValidationErrors,
    ]
  );

  /**
   * Go to a specific step directly
   */
  const goToStep = useCallback(
    (step: FormStep) => {
      clearAllValidationErrors();
      setCurrentStep(step);

      // Navigate to the appropriate route
      const routes: Record<FormStep, string> = {
        1: '/step1',
        2: '/step2',
        3: '/step3',
      };
      routerNavigate(routes[step]);
    },
    [routerNavigate, setCurrentStep, clearAllValidationErrors]
  );

  /**
   * Submit the form (navigate to review)
   */
  const submit = useCallback(() => {
    // Validate all steps
    const step1Valid = validateStep(1);
    const step2Valid = validateStep(2);
    const step3Valid = validateStep(3);

    if (!step1Valid || !step2Valid || !step3Valid) {
      return false;
    }

    clearAllValidationErrors();
    routerNavigate('/review');
    return true;
  }, [validateStep, clearAllValidationErrors, routerNavigate]);

  /**
   * Check if we can go to the next step
   */
  const canGoNextValue = useCallback(() => {
    // Check if there are validation errors for the current step
    return canProceed() && currentStep < totalSteps;
  }, [canProceed, currentStep]);

  /**
   * Check if we can go to the previous step
   */
  const canGoPrev = currentStep > 1;

  /**
   * Get validation errors for the current step
   */
  const getCurrentStepErrors = useCallback(() => {
    return validationErrors;
  }, [validationErrors]);

  /**
   * Check if current step has errors
   */
  const hasCurrentStepErrors = useCallback(() => {
    return Object.keys(validationErrors).length > 0;
  }, [validationErrors]);

  return {
    currentStep,
    navigate: handleNavigate,
    goToStep,
    submit,
    canGoNext: canGoNextValue(),
    canGoPrev,
    totalSteps,
    validationErrors,
    getCurrentStepErrors,
    hasCurrentStepErrors,
  };
};
