import React from 'react';
import Icon from './Icon';

export const Input = React.forwardRef(
  (
    {
      label,
      error,
      hint,
      icon,
      iconRight,
      className = '',
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Icon name={icon} size="md" />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full rounded-lg border text-sm transition-colors focus:outline-none focus:ring-2 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 ${
              icon ? 'pl-10' : 'pl-3.5'
            } ${iconRight ? 'pr-10' : 'pr-3.5'} ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-primary focus:ring-primary/20'
            } py-2.5 ${className}`}
            {...props}
          />
          {iconRight && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400">
              <Icon name={iconRight} size="md" />
            </div>
          )}
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

Input.displayName = 'Input';
export default Input;
