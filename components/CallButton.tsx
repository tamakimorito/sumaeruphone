
import React from 'react';

export const CallButton = ({ 
  onClick, 
  children, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:shadow-none active:bg-indigo-800 active:scale-[0.98] transition-all duration-150 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
};
