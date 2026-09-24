import React from 'react';

interface TextareaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

export const Textarea = ({ value, onChange, placeholder, rows = 4 }: TextareaProps) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-bg rounded-xl px-4 py-2 text-text placeholder:text-text/50 focus:outline-none focus:ring-2 focus:ring-custom-accent resize-none"
    />
  );
};