/**
 * API service for submitting intake data to Gatechecker
 * This is a mock implementation that simulates the API call
 * In production, this would connect to the actual Gatechecker endpoint
 */

import { IntakePayload } from '@/types/intake';
import { transformToGatecheckerPayload } from '@/lib/transformers/toGatecheckerFormat';
import { IntakeStore } from '@/store/useIntakeStore';

// ============================================================================
// TYPES
// ============================================================================

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

interface SubmissionResult {
  id: string;
  status: 'valid' | 'invalid' | 'pending';
  message: string;
  payload?: IntakePayload;
  errors?: string[];
}

// ============================================================================
// API CONFIGURATION
// ============================================================================

// In production, this would be configured via environment variables
// For development, we use defaults
const API_DELAY_MS = 1000;

// ============================================================================
// MOCK DATA FOR DEVELOPMENT
// ============================================================================

/**
 * Simulate API validation
 * In production, this would be replaced with actual fetch call
 */
async function mockValidateIntake(payload: IntakePayload): Promise<ApiResponse<SubmissionResult>> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

  // Basic validation checks (simulating Gatechecker logic)
  const errors: string[] = [];

  // Check school
  if (!payload.school?.name?.trim()) {
    errors.push('School name is required');
  }

  // Check subjects
  if (!payload.subjects || payload.subjects.length === 0) {
    errors.push('At least one subject is required');
  }

  // Check teachers
  if (!payload.teachers || payload.teachers.length === 0) {
    errors.push('At least one teacher is required');
  }

  // Check for duplicate teacher IDs
  const teacherIds = payload.teachers?.map((t) => t.teacher_id);
  if (teacherIds && new Set(teacherIds).size !== teacherIds.length) {
    errors.push('Duplicate teacher IDs found');
  }

  // Check for duplicate subject codes
  const subjectCodes = payload.subjects?.map((s) => s.subject_code);
  if (subjectCodes && new Set(subjectCodes).size !== subjectCodes.length) {
    errors.push('Duplicate subject codes found');
  }

  if (errors.length > 0) {
    return {
      success: false,
      error: 'Validation failed',
      message: 'The intake data contains errors',
      data: {
        id: `submission-${Date.now()}`,
        status: 'invalid',
        message: 'Validation failed',
        errors,
      },
    };
  }

  // If no errors, return success
  return {
    success: true,
    message: 'Intake data validated successfully',
    data: {
      id: `submission-${Date.now()}`,
      status: 'valid',
      message: 'Data is ready for Workload Balancer',
      payload,
    },
  };
}

// ============================================================================
// MAIN API FUNCTIONS
// ============================================================================

/**
 * Submit intake data for validation
 * Uses mock in development, real API in production
 */
export async function submitIntakeData(
  payload: IntakePayload
): Promise<ApiResponse<SubmissionResult>> {
  // For now, use mock
  return mockValidateIntake(payload);
}

/**
 * Submit intake data from store state
 * Transforms store state to payload and submits
 */
export async function submitFromStore(
  storeState: IntakeStore
): Promise<ApiResponse<SubmissionResult>> {
  const payload = transformToGatecheckerPayload(storeState);
  return submitIntakeData(payload);
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Download the intake data as JSON file
 * Useful for debugging and manual submission
 */
export function downloadIntakeData(payload: IntakePayload, filename?: string) {
  const dataStr = JSON.stringify(payload, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

  const link = document.createElement('a');
  link.href = dataUri;
  link.download = filename || `mobius-muse-intake-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Copy intake data to clipboard
 */
export async function copyIntakeDataToClipboard(payload: IntakePayload): Promise<boolean> {
  try {
    const dataStr = JSON.stringify(payload, null, 2);
    await navigator.clipboard.writeText(dataStr);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Log intake data to console (for debugging)
 */
export function logIntakeData(payload: IntakePayload) {
  console.group('Intake Data');
  console.log('Schema Version:', payload.schema_version);
  console.log('School:', payload.school);
  console.log('Policy:', payload.policy);
  console.log('Subjects:', payload.subjects);
  console.log('Teachers:', payload.teachers);
  console.log('Capabilities:', payload.capabilities);
  console.log('Preferences:', payload.preferences);
  console.groupEnd();
}
