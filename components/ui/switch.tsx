import * as SwitchPrimitive from '@radix-ui/react-switch';

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
}

export const Switch = ({ checked, onCheckedChange, label }: SwitchProps) => {
  return (
    <div className="flex items-center">
      <SwitchPrimitive.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-11 h-6 bg-bg data-[state=checked]:bg-custom-accent rounded-full relative"
      >
        <SwitchPrimitive.Thumb className="block w-5 h-5 bg-bg-light rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
      </SwitchPrimitive.Root>
      {label && <span className="ml-2 text-sm text-text">{label}</span>}
    </div>
  );
};