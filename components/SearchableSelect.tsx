
import React, { useState, useEffect, useRef } from 'react';

export const SearchableSelect = ({
  id,
  label,
  options,
  value,
  onChange,
  onSelect,
  placeholder,
  disabled,
  'aria-describedby': ariaDescribedby,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const lowercasedValue = value.toLowerCase();
      setFilteredOptions(
        options.filter(option => option.name.toLowerCase().includes(lowercasedValue))
      );
    } else {
      setFilteredOptions(options);
    }
  }, [value, options]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value);
    if(!isOpen) setIsOpen(true);
  };

  return (
    <div className="relative" ref={containerRef}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input
        type="text"
        id={id}
        value={value}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        aria-describedby={ariaDescribedby}
        className="block w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm placeholder-slate-400 transition-colors duration-150 ease-in-out disabled:bg-slate-50 disabled:cursor-not-allowed"
      />
      {isOpen && !disabled && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option, index) => (
              <li
                key={`${option.number}-${index}`}
                onClick={() => handleSelect(option)}
                className="px-4 py-2.5 text-sm text-slate-800 cursor-pointer hover:bg-indigo-50"
                role="option"
                aria-selected={value === option.name}
              >
                <span className="font-medium">{option.name}</span>
                <span className="text-slate-500 ml-2">{option.number}</span>
              </li>
            ))
          ) : (
            <li className="px-4 py-2.5 text-sm text-slate-500">一致する結果がありません</li>
          )}
        </ul>
      )}
    </div>
  );
};
