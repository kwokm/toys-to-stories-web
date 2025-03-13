import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

// Define card grid variants using cva
const cardGridVariants = cva(
  "grid gap-8 w-full", 
  {
    variants: {
      layout: {
        default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        compact: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
        wide: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      },
      spacing: {
        default: "gap-8",
        tight: "gap-4",
        loose: "gap-16",
      }
    },
    defaultVariants: {
      layout: "default",
      spacing: "default",
    }
  }
);

export interface CardGridProps extends VariantProps<typeof cardGridVariants> {
  children: ReactNode;
  className?: string;
}

export function CardGrid({ 
  children, 
  layout, 
  spacing,
  className = "" 
}: CardGridProps) {
  return (
    <div className={cardGridVariants({ layout, spacing, className })}>
      {children}
    </div>
  );
}

// Define card container variants
const cardContainerVariants = cva(
  "relative transition-all duration-300", 
  {
    variants: {
      variant: {
        default: "bg-white rounded-lg shadow-md hover:shadow-lg",
        toy: "bg-white rounded-xl shadow-md hover:shadow-lg border border-orange-100",
        story: "bg-white rounded-xl shadow-xl hover:shadow-2xl",
        interactive: "bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer",
      },
      animation: {
        none: "",
        float: "motion-translate-y-loop-10 motion-duration-2000 motion-ease-in-out",
        pulse: "motion-scale-loop-[102%] motion-duration-2000 motion-ease-in-out",
        tilt: "hover:rotate-1",
      }
    },
    defaultVariants: {
      variant: "default",
      animation: "none",
    }
  }
);

export interface CardContainerProps extends VariantProps<typeof cardContainerVariants> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function CardContainer({ 
  children, 
  variant, 
  animation,
  className = "",
  onClick
}: CardContainerProps) {
  return (
    <div 
      className={cardContainerVariants({ variant, animation, className })}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

// Export a combined Card component for convenience
export function Card({ 
  children,
  variant, 
  animation,
  className = "",
  onClick
}: CardContainerProps) {
  return (
    <CardContainer
      variant={variant}
      animation={animation}
      className={className}
      onClick={onClick}
    >
      {children}
    </CardContainer>
  );
} 