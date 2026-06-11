import React from 'react';
import { ImSpinner8 } from 'react-icons/im';

const LoadingSpinner = ({ message = 'Fetching profile details...', fullPage = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <ImSpinner8 className="text-4xl text-primary animate-spin" />
      <div>
        <p className="text-sm font-semibold text-white tracking-wide">{message}</p>
        <p className="text-xs text-brandDark-500 mt-1">This might take a moment if calling GitHub APIs.</p>
      </div>
    </div>
  );

  if (fullPage) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
