import { SelectHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, options, disabled, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-textSecondary mb-1.5">
            {label}
            {props.required && <span className="text-brushedBrass ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          disabled={disabled}
          className={twMerge(
            'w-full px-4 py-2 rounded bg-headerBlue/20 border border-headerBlue/30',
            'text-textPrimary focus:outline-none focus:ring-2 focus:ring-brushedBrass',
            'transition-all duration-200 appearance-none',
            error && 'border-error focus:ring-error',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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

Select.displayName = 'Select';
