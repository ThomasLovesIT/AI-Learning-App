import React from 'react';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="relative flex items-center justify-center">
        {/* Background Ring */}
        <div className="w-12 h-12 rounded-full border-4 border-blue-100"></div>
        
        {/* Spinning Indicator */}
        <div className="absolute top-0 left-0 w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Spinner;