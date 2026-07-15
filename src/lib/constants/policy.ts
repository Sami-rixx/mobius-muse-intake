export interface PolicyQuestion {
  id: string;
  question: string;
  options: {
    value: string;
    label: string;
    mapsTo: string | boolean;
  }[];
  description: string;
}

export const POLICY_QUESTIONS: PolicyQuestion[] = [
  {
    id: 'q1',
    question: 'Can generalists teach any grade?',
    options: [
      { value: 'no', label: 'No', mapsTo: 'explicit_only' },
      { value: 'yes', label: 'Yes', mapsTo: 'unrestricted' },
    ],
    description: 'Determines if generalist teachers can be assigned to any grade or only explicitly defined grades',
  },
  {
    id: 'q2',
    question: 'What to do with insufficient hours?',
    options: [
      { value: 'stop', label: 'Stop and tell me', mapsTo: 'block' },
      { value: 'go', label: 'Go ahead anyway', mapsTo: 'allow-overload' },
    ],
    description: 'Determines the system behavior when teacher capacity is exceeded',
  },
  {
    id: 'q3',
    question: 'What to do with unclear data?',
    options: [
      { value: 'default', label: 'Use sensible default', mapsTo: 'use_default_and_warn' },
      { value: 'resolve', label: 'Stop and resolve', mapsTo: 'block_until_resolved' },
    ],
    description: 'Determines how to handle ambiguous or incomplete data',
  },
  {
    id: 'q4',
    question: 'Do specialists exist in this school?',
    options: [
      { value: 'yes', label: 'Yes', mapsTo: true },
      { value: 'no', label: 'No', mapsTo: false },
    ],
    description: 'Determines if specialist teacher constraints should be enforced',
  },
];

export function getPolicyValue(questionId: string, uiValue: string): string | boolean {
  const question = POLICY_QUESTIONS.find(q => q.id === questionId);
  const option = question?.options.find(o => o.value === uiValue);
  return option?.mapsTo || '';
}
