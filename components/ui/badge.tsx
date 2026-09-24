
interface BadgeProps {
  label: string;
  variant?: 'default' | 'outline' | 'secondary' | 'defaultrounded' | 'outlinerounded' | 'secondaryrounded';
}

export const Badge = ({ label, variant = 'default' }: BadgeProps) => {
  const variants = {
    default: 'bg-accent text-primary',
    outline: 'border border-accent text-accent',
    secondary: 'bg-bg text-primary',
    defaultrounded: 'bg-accent text-primary rounded-xl',
    outlinerounded: 'border border-accent text-accent rounded-xl',
    secondaryrounded: 'bg-bg text-primary rounded-xl',
  };

  return (
    <span className={`${variants[variant]} px-2 py-1 rounded-lg text-xs font-medium`}>
      {label}
    </span>
  );
};