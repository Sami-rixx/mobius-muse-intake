import { InputHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-textSecondary mb-1.5">
            {label}
            {props.required && <span className="text-brushedBrass ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={twMerge(
            'w-full px-4 py-2 rounded bg-headerBlue/20 border border-headerBlue/30',
            'text-textPrimary placeholder:text-textMuted',
            'focus:outline-none focus:ring-2 focus:ring-brushedBrass focus:border-transparent',
            'transition-all duration-200',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        {hint && !error && (
          <p className="mt-1 text-sm text-textMuted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
