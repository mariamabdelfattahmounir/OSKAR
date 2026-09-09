import React from 'react';

export const Checkbox = React.forwardRef(
  ({ label, description, className = '', id, ...props }, ref) => {
    const checkboxId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 mt-0.5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`w-4 h-4 rounded text-primary focus:ring-primary/40 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer ${className}`}
            {...props}
          />
        </div>
        {label && (
          <div className="text-sm">
            <label htmlFor={checkboxId} className="font-medium text-slate-900 dark:text-slate-100 cursor-pointer select-none">
              {label}
            </label>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export const Radio = React.forwardRef(
  ({ label, description, className = '', id, ...props }, ref) => {
    const radioId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-start gap-3">
        <div className="flex items-center h-5 mt-0.5">
          <input
            ref={ref}
            id={radioId}
            type="radio"
            className={`w-4 h-4 text-primary focus:ring-primary/40 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 cursor-pointer ${className}`}
            {...props}
          />
        </div>
        {label && (
          <div className="text-sm">
            <label htmlFor={radioId} className="font-medium text-slate-900 dark:text-slate-100 cursor-pointer select-none">
              {label}
            </label>
            {description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';

export default Checkbox;
