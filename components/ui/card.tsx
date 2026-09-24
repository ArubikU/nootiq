"use client";
import { cn } from "@/lib/utils";
import { createContext, forwardRef, HTMLAttributes, ReactNode, useContext } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  header?: ReactNode;
  variant?: 'default' | 'bg' | 'surface';
  titleClassName?: string;
}

interface CardContextType {
  variant: 'default' | 'bg' | 'surface';
}

const CardContext = createContext<CardContextType>({ variant: 'default' });

const getVariantClasses = (variant: 'default' | 'bg' | 'surface') => {
  switch (variant) {
    case 'bg':
      return 'bg-accent';
    case 'surface':
      return 'bg-primary';
    default:
      return 'bg-primary';
  }
};

const getTitleColorClasses = (variant: 'default' | 'bg' | 'surface') => {
  switch (variant) {
    case 'bg':
      return 'text-primary';
    case 'surface':
      return 'text-accent-heavy';
    default:
      return '';
  }
};
const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, title, description, header, variant = 'default', titleClassName, children, ...props }, ref) => (
    <CardContext.Provider value={{ variant }}>
      <div
        ref={ref}
        className={cn(
          "rounded-2xl shadow-md shadow-sm",
          getVariantClasses(variant),
          className
        )}
        {...props}
      >
        {title && <h2 className={cn(`${getTitleColorClasses(variant)} text-xl font-semibold mb-2 text-center`, titleClassName)}>{title}</h2>}
        {header && <div className="mb-4">{header}</div>}
        {description && <p className="text-center mb-4 text-sm">{description}</p>}
        {children}
      </div>
    </CardContext.Provider>
  )
)
Card.displayName = "Card"

const CardHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 mb-4", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { variant } = useContext(CardContext);
  return (
    <div
      ref={ref}
      className={cn(
        "text-xl font-semibold mb-2",
        getTitleColorClasses(variant),
        className
      )}
      {...props}
    />
  )
})
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-custom-muted mb-4", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center pt-4", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
