import React from 'react';

export const Table = ({ children, className = '' }) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 ${className}`}>
      <table className="w-full text-left text-sm border-collapse">{children}</table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return (
    <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
      {children}
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">{children}</tbody>;
};

export const TableRow = ({ children, className = '', onClick }) => {
  return (
    <tr
      onClick={onClick}
      className={`transition-colors ${onClick ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40' : ''} ${className}`}
    >
      {children}
    </tr>
  );
};

export const TableHead = ({ children, className = '' }) => {
  return <th className={`p-4 font-semibold ${className}`}>{children}</th>;
};

export const TableCell = ({ children, className = '' }) => {
  return <td className={`p-4 text-slate-700 dark:text-slate-300 ${className}`}>{children}</td>;
};

export default Table;
