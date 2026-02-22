import React from 'react';

const Spinner = ({ size = 'md', color = 'blue' }) => {
  const sizeMap = {
    sm: 'w-4 h-4 border-2',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-4',
  };

  const colorMap = {
    blue:  { track: 'border-blue-100',  spin: 'border-blue-600' },
    white: { track: 'border-white/30',  spin: 'border-white' },
    indigo:{ track: 'border-indigo-100',spin: 'border-indigo-600' },
  };

  const sizeClass  = sizeMap[size]  ?? sizeMap.md;
  const colorClass = colorMap[color] ?? colorMap.blue;

  // Only add the full-page centering wrapper for standalone (md/lg) usage
  if (size === 'md' || size === 'lg') {
    return (
      <div className="flex items-center justify-center min-h-[400px] w-full">
        <div className="relative flex items-center justify-center">
          <div className={`${sizeClass} rounded-full border ${colorClass.track}`} />
          <div className={`absolute inset-0 rounded-full border ${sizeClass} border-t-transparent animate-spin ${colorClass.spin}`} />
        </div>
      </div>
    );
  }

  // sm = inline, no wrapper — safe to use inside buttons
  return (
    <div className="relative flex items-center justify-center">
      <div className={`${sizeClass} rounded-full border ${colorClass.track}`} />
      <div className={`absolute inset-0 rounded-full border ${sizeClass} border-t-transparent animate-spin ${colorClass.spin}`} />
    </div>
  );
};

export default Spinner;