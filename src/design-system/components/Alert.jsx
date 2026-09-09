import React from 'react';
import Icon from './Icon';

export const Alert = ({
  type = 'note',
  title,
  children,
  className = '',
}) => {
  const styles = {
    note: {
      border: 'border-sky-200 dark:border-sky-900',
      bg: 'bg-sky-50 dark:bg-sky-950/30',
      text: 'text-sky-900 dark:text-sky-200',
      icon: 'info',
      iconColor: 'text-sky-600 dark:text-sky-400',
    },
    tip: {
      border: 'border-emerald-200 dark:border-emerald-900',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-900 dark:text-emerald-200',
      icon: 'lightbulb',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    important: {
      border: 'border-purple-200 dark:border-purple-900',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      text: 'text-purple-900 dark:text-purple-200',
      icon: 'priority_high',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
    warning: {
      border: 'border-amber-200 dark:border-amber-900',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-900 dark:text-amber-200',
      icon: 'warning',
      iconColor: 'text-amber-600 dark:text-amber-400',
    },
    caution: {
      border: 'border-rose-200 dark:border-rose-900',
      bg: 'bg-rose-50 dark:bg-rose-950/30',
      text: 'text-rose-900 dark:text-rose-200',
      icon: 'error',
      iconColor: 'text-rose-600 dark:text-rose-400',
    },
  };

  const current = styles[type] || styles.note;

  return (
    <div
      className={`p-4 rounded-xl border ${current.border} ${current.bg} ${current.text} flex items-start gap-3 ${className}`}
    >
      <div className={`mt-0.5 ${current.iconColor}`}>
        <Icon name={current.icon} size="lg" />
      </div>
      <div className="flex-1 text-sm">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Alert;
