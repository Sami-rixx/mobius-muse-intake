import React from 'react';
import { PRIORITY_CONFIG } from '@/lib/constants';

interface PriorityBadgeProps {
  priority: 1 | 2 | 3;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  size = 'md',
  showLabel = false,
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
      className={`
        ${config.color} ${config.textColor}
        ${sizeStyles[size]}
        rounded-full font-mono font-medium
        inline-flex items-center gap-1.5
      `}
    >
      {showLabel && <span>{config.label}</span>}
      <span>{priority}</span>
    </span>
  );
};
