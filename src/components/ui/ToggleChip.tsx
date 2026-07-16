import React from 'react';
import { twMerge } from 'tailwind-merge';
import { PRIORITY_CONFIG } from '@/lib/constants';

interface ToggleChipProps {
  selected: boolean;
  priority?: 1 | 2 | 3 | null; // null = not selected
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ToggleChip: React.FC<ToggleChipProps> = ({
  selected,
  priority,
  label,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  // Get styles based on state
  const getChipStyles = () => {
    if (!selected) {
      return 'bg-headerBlue/30 text-textSecondary hover:bg-headerBlue/50';
    }

    if (priority) {
      const config = PRIORITY_CONFIG[priority];
      return `${config.color} ${config.textColor}`;
    }

    return 'bg-accentTeal text-white';
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={twMerge(
        'cursor-pointer rounded-full font-medium transition-all',
        'focus:outline-none focus:ring-2 focus:ring-brushedBrass focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        sizeStyles[size],
        getChipStyles(),
        className
      )}
    >
      {label}
    </button>
  );
};
