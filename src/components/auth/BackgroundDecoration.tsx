
import React from 'react';

const BackgroundDecoration = () => {
  return (
    <div className="absolute inset-0 opacity-40">
      <svg 
        className="w-full h-full" 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="dots" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
            <circle cx="5" cy="5" r="1" fill="#9C92AC" fillOpacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>
    </div>
  );
};

export default BackgroundDecoration;
