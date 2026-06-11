import React from 'react';
import { BiErrorCircle } from 'react-icons/bi';

const ErrorMessage = ({ message, retryAction }) => {
  return (
    <div className="glass-card max-w-md mx-auto p-6 rounded-2xl border border-danger/20 text-center shadow-lg my-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-danger/10 text-danger border border-danger/20">
          <BiErrorCircle className="text-3xl" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2 font-heading">Something went wrong</h3>
      <p className="text-sm text-brandDark-400 mb-6 leading-relaxed">
        {message || 'An error occurred while communicating with the server.'}
      </p>
      {retryAction && (
        <button
          onClick={retryAction}
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-brandDark-900 border border-brandDark-800 text-white hover:bg-brandDark-800 transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
