import React from 'react';

/**
 * Renders a Material Symbols Outlined icon.
 */
export const Icon = ({ name, className = '', fill = false, size = 'md', ...props }) => {
  const sizeClasses = {
    sm: 'text-sm w-4 h-4',
    md: 'text-base w-5 h-5',
    lg: 'text-xl w-6 h-6',
    xl: 'text-2xl w-8 h-8',
    '2xl': 'text-4xl w-10 h-10',
  };

  return (
    <span
      className={`material-symbols-outlined select-none inline-flex items-center justify-center ${
        sizeClasses[size] || ''
      } ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
      }}
      {...props}
    >
      {name}
    </span>
  );
};

export default Icon;
