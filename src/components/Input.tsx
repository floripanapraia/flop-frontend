import React from 'react';

interface InputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  helperText?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  name,
  value,
  onChange,
  type = 'text',
  helperText,
  error,
}) => {
  return (
    <div className="mb-4">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={label}
        className={`w-full px-3 py-2 text-gray-700 bg-gray-200 rounded ${error ? 'border border-red-500' : ''
          }`}
      />
      {helperText && <p className="text-xs text-gray-500 mt-1">{helperText}</p>}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;