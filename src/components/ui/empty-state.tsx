import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cva, type VariantProps } from 'class-variance-authority';

// Define empty state variants using cva
const emptyStateVariants = cva(
  "flex flex-col items-center justify-center text-center", 
  {
    variants: {
      size: {
        sm: "min-h-[20vh] py-6",
        md: "min-h-[30vh] py-8",
        lg: "min-h-[50vh] py-12",
        xl: "min-h-[70vh] py-16",
      },
      padding: {
        none: "",
        sm: "px-4",
        md: "px-8",
        lg: "px-16",
      }
    },
    defaultVariants: {
      size: "lg",
      padding: "md",
    }
  }
);

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "ghost" | "link";
    icon?: ReactNode;
  };
  className?: string;
  children?: ReactNode;
}

export function EmptyState({ 
  title,
  description,
  icon,
  action,
  size,
  padding,
  className = "",
  children,
}: EmptyStateProps) {
  return (
    <div className={emptyStateVariants({ size, padding, className })}>
      {icon && (
        <div className="mb-6 text-orange-400">
          {icon}
        </div>
      )}
      
      <h2 className="mb-4 text-xl font-medium text-slate-900">{title}</h2>
      
      {description && (
        <p className="mb-6 text-slate-600">{description}</p>
      )}
      
      {action && (
        <Button 
          onClick={action.onClick}
          variant={action.variant || "default"}
          className={action.variant === "default" ? "mesh-gradient overflow-clip text-black" : ""}
        >
          {action.icon && (
            <span className="mr-2">{action.icon}</span>
          )}
          {action.label}
        </Button>
      )}
      
      {children}
    </div>
  );
} 