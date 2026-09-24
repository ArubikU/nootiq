"use client";
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl shadow transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary hover:bg-muted",
        secondary: "bg-secondary text-primary hover:bg-muted",
        outline: "border bg-primary border-accent text-accent hover:bg-accent hover:text-primary",
        ghost: "text-accent-light hover:bg-accent hover:text-primary",
        destructive: "bg-error hover:bg-error-heavy text-primary",
        clean: ""
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
