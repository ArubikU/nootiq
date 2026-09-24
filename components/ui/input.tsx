export const Input = ({ placeholder, value, onChange, onKeyPress, disabled, className, ref }: {
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  ref?: React.Ref<HTMLInputElement>;
}) => (
  <input
    ref={ref}
    className={`border border-bg bg-bg-light rounded-xl px-4 py-2 w-full text-text focus:outline-none focus:ring-2 focus:ring-custom-accent ${className || ''}`}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    onKeyPress={onKeyPress}
    disabled={disabled}
  />
);