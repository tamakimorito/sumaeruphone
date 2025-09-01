
import React from 'react';

export const InputWithLabel = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  inputMode,
  autoComplete,
  'aria-describedby': ariaDescribedby,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        aria-describedby={ariaDescribedby}
        className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-400 transition-colors duration-150 ease-in-out"
      />
    </div>
  );
};
