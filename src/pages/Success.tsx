import React from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useNavigate } from 'react-router-dom';

export const Success: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="text-center max-w-md">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-brushedBrass"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-display font-bold text-textPrimary mb-2">
          Submission Successful!
        </h2>

        <p className="text-textSecondary mb-6">
          Your school data has been successfully validated and is ready for the
          Workload Balancer.
        </p>

        <Button
          variant="accent"
          onClick={() => navigate('/step1')}
          className="w-full"
        >
          Start New Intake
        </Button>
      </Card>
    </div>
  );
};
