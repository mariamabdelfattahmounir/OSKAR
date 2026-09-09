import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const variants = {
    default: 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700',
    primary: 'bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800',
    success: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    danger: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    info: 'bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-semibold rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusPill = ({ status, className = '' }) => {
  const statusMap = {
    active: { label: 'Active', variant: 'success' },
    approved: { label: 'Approved', variant: 'success' },
    completed: { label: 'Completed', variant: 'primary' },
    in_review: { label: 'In Review', variant: 'warning' },
    pending: { label: 'Pending', variant: 'warning' },
    draft: { label: 'Draft', variant: 'default' },
    archived: { label: 'Archived', variant: 'default' },
    rejected: { label: 'Rejected', variant: 'danger' },
  };

  const current = statusMap[status?.toLowerCase()] || { label: status || 'Unknown', variant: 'default' };

  return <Badge variant={current.variant} className={className}>{current.label}</Badge>;
};

export default Badge;
