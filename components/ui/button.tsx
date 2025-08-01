"use client";
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-iris text-white hover:bg-iris/90",
        secondary: "bg-gray-500 text-white hover:bg-gray-500/90",
        outline: "border border-iris text-iris hover:bg-iris hover:text-white",
        ghost: "text-iris hover:bg-iris/10",
        destructive: "bg-red-500 text-white hover:bg-red-600",
      },
      size: {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl",
        icon: "p-2"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  label?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, onClick, children, variant, size, asChild = false, disabled = false, className, ...props }, ref) => {
    const buttonClassName = buttonVariants({ variant, size, className });

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        className: `${(children.props as any).className || ''} ${buttonClassName}`.trim(),
        onClick: disabled ? undefined : (event: React.MouseEvent) => {
          onClick?.(event as React.MouseEvent<HTMLButtonElement>);
          (children.props as any).onClick?.(event);
        },
        disabled,
      } as any);
    }

    return (
      <button
        ref={ref}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
        className={buttonClassName}
        {...props}
      >
        {children || label}
      </button>
    );
  }
);

Button.displayName = "Button";
