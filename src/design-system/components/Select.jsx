import React from 'react';
import Icon from './Icon';

export const Select = React.forwardRef(
  (
    {
      label,
      options = [],
      error,
      hint,
      className = '',
      id,
      children,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full appearance-none rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 pl-3.5 pr-10 py-2.5 ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
            } ${className}`}
            {...props}
          >
            {children
              ? children
              : options.map((opt) => (
                  <option
                    key={typeof opt === 'string' ? opt : opt.value}
                    value={typeof opt === 'string' ? opt : opt.value}
                  >
                    {typeof opt === 'string' ? opt : opt.label}
                  </option>
                ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <Icon name="expand_more" size="md" />
          </div>
        </div>
        {error && (
          <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
            <Icon name="error" size="sm" />
            <span>{error}</span>
          </p>
        )}
        {!error && hint && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
