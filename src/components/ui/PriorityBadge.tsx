import React from 'react';
import { PRIORITY_CONFIG } from '@/lib/constants';
import { twMerge } from 'tailwind-merge';

interface PriorityBadgeProps {
  priority: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  const config = PRIORITY_CONFIG[priority];

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <span
      className={twMerge(
        `
        ${config.color} ${config.textColor}
        ${sizeStyles[size]}
        inline-flex items-center gap-1.5
        rounded-full font-mono font-medium
      `,
        className
      )}
    >
      {showLabel && <span>{config.label}</span>}
      <span>{priority}</span>
    </span>
  );
};
